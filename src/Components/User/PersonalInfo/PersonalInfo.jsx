import React, { useState } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import FooterFormUser from '../FooterFormUser'
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { Link } from 'react-router-dom'
import "../User.css"
import axios from 'axios'
import { API_GET_USER_INFO, API_UPDATE_USER_INFO } from '../../../Services/common'
import { async } from '@firebase/util'
import { fi } from 'date-fns/locale'
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../../../Hooks/FireBase.config'
import UserService from '../../../Services/UserService'

const PersonalInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [editState, setEditState] = useState({
        isEditNameOpen: false,
        isEditPhoneOpen: false,
        isEditEmailOpen: false,
        isEditContinueWithPhone: false
    })

    const [saveDisabled, setSaveDisabled] = useState({
        editName: false,
        editPhone: false,
        editEmail: false,
        editContinueWithPhone: false
    });

    const [inputValues, setInputValues] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });

    const [isEmpty, setIsEmpty] = useState({
        firstName: false,
        lastName: false,
        phone: false,
        email: false
    });

    const handleInputChange = (fieldName, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const resetEmpty = () => {
        setIsEmpty({
            firstName: false,
            lastName: false,
            phone: false,
            email: false
        })
    }

    const checkEmpty = (fieldName, value) => {
        if (value.trim() === '') {
            setIsEmpty(prevState => ({
                ...prevState,
                [fieldName]: true
            }));
            setSaveDisabled(prevState => ({
                ...prevState,
                [getSaveType(fieldName)]: true
            }))
        } else {
            setIsEmpty(prevState => ({
                ...prevState,
                [fieldName]: false
            }));
            setSaveDisabled(prevState => ({
                ...prevState,
                [getSaveType(fieldName)]: false
            }));
        }
    };

    const getSaveType = (fieldName) => {
        switch (fieldName) {
            case 'firstName':
                return 'editName';
            case 'lastName':
                return 'editName';
            case 'phone':
                return 'editPhone';
            case 'email':
                return 'editEmail';
            default:
                return '';
        }
    };

    const [selectedDiv, setSelectedDiv] = useState(null);

    const handleDivClick = (field) => {
        setSelectedDiv(field);
    };

    const [editFirstName, setEditFirstName] = useState(userInfo ? userInfo.firstName : '');
    const [editLastName, setEditLastName] = useState(userInfo ? userInfo.lastName : '');
    const [editEmail, setEditEmail] = useState(userInfo ? userInfo.email : '')

    const [tempFirstName, setTempFirstName] = useState(userInfo ? userInfo.firstName : '');
    const [tempLastName, setTempLastName] = useState(userInfo ? userInfo.lastName : '');

    const [tempEmail, setTempEmail] = useState(userInfo ? userInfo.email : '');

    const [isEmailValid, setIsEmailValid] = useState(true);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleButtonClick = async () => {
        setIsSaveLoading(true); // Hiển thị loading

        // Chờ 1 giây
        await new Promise(resolve => setTimeout(resolve, 600));

        // Sau khi chờ xong, chạy hàm handleSave
        handleSave();
    };

    const handleSave = async () => {
        setEditFirstName(tempFirstName);
        setEditLastName(tempLastName);
        setEditEmail(tempEmail);

        if (!validateEmail(tempEmail)) {
            setIsEmailValid(false);
            setIsSaveLoading(false);
            return;
        }

        setIsEmailValid(true);

        if (editState.isEditNameOpen) {
            setEditState(prev => ({
                ...prev,
                isEditNameOpen: false
            }))
        }
        if (editState.isEditEmailOpen) {
            setEditState(prev => ({
                ...prev,
                isEditEmailOpen: false
            }))
        }
        if (tempFirstName) {
            await handleSaveChanges('firstName', tempFirstName);
        }
        if (tempLastName) {
            await handleSaveChanges('lastName', tempLastName);
        }
        if (tempEmail) {
            await handleSaveChanges('email', tempEmail);
        }
        const updateUserInfo = JSON.parse(localStorage.getItem('userInfo'));

        updateUserInfo.firstName = tempFirstName || updateUserInfo.firstName;
        updateUserInfo.lastName = tempLastName || updateUserInfo.lastName;
        updateUserInfo.email = tempEmail || updateUserInfo.email;

        localStorage.setItem('userInfo', JSON.stringify(updateUserInfo));
        document.querySelector('#name-display').textContent = `${tempFirstName || updateUserInfo.firstName} ${tempLastName || updateUserInfo.lastName}`;
        document.querySelector('#email-display').textContent = `${tempEmail || updateUserInfo.email}`;

        setIsSaveLoading(false);
    };

    const handleCancel = () => {
        setTempFirstName(userInfo.firstName);
        setTempLastName(userInfo.lastName);
        setTempEmail(userInfo.email);
    };

    const handleToggleEditDiv = (type) => {
        setEditState(prev => ({
            ...prev,
            [type]: !prev[type]
        }))
    }


    var hiddenEmail = '';
    if (userInfo && userInfo.email) {
        const [username, domain] = userInfo.email.split('@');
        const usernameHidden = username.charAt(0) + '...' + username.charAt(username.length - 1);
        hiddenEmail = usernameHidden + "@" + domain;
    }
    const userPhone = userInfo && userInfo.phone && userInfo.phone || null;
    const hiddenPhone = `+84 ${'**'} ${'**'}${userPhone.slice(7, 8)} ${userPhone.slice(8)}`;

    const handleSaveChanges = async (field, value) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.patch(API_UPDATE_USER_INFO, {
                [field]: value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('Cập nhật thành công');
            } else {
                console.error('Cập nhật không thành công');
            }
        } catch (error) {
            console.error(error);
        }
    }
    const [phoneNumber, setPhoneNumber] = useState('');

    const ValidationTextField = styled(TextField)({
        '& input:valid + fieldset': {
            borderColor: 'black',
            borderWidth: 1,
        },
        '& input:invalid + fieldset': {
            borderColor: '#b8b4b4',
            borderWidth: 1,
        },
        '& input:valid:focus + fieldset': {
            borderColor: 'black',
            borderLeftWidth: 4,
            padding: '4px !important', // override inline-style
        },
    });

    const [identifiedPhone, setIdentifiedPhone] = useState(false);

    const onSignup = () => {
        if (userInfo.phone === `+${selectedCountry?.phone}${phoneNumber}`) {
            setIdentifiedPhone(true);
            return;
        }
        setIsSaveLoading(true)
        onCaptchVerify();
        const appVerifier = window.applicationVerifier
        const phone = "+" + selectedCountry?.phone + phoneNumber;
        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                handleToggleEditDiv('isEditContinueWithPhone');
                handleToggleEditDiv('isEditPhoneOpen')
                setIsSaveLoading(false)

            }).catch((error) => {
                console.error(error);
                setIsSaveLoading(false)
            });
    }

    function onCaptchVerify() {
        if (!window.applicationVerifier) {
            window.applicationVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': "invisible",
                'callback': (response) => {
                    onSignup();
                },
                'expired-callback': () => {
                }
            });
        }
    }
    const [valueOTP, setValueOTP] = useState("");

    const [validOTP, setValidOTP] = useState("")

    const [checkEmptyOTP, setCheckEmptyOTP] = useState(false);

    const handleCheckOTPInput = (e) => {
        e.persist();

        const value = e.target.value;
        setCheckEmptyOTP(value === '');
    }

    const onOTPVerify = async () => {
        setIsSaveLoading(true);
        window.confirmationResult
            .confirm(valueOTP)
            .then(async (res) => {
                if (await UserService.loginUser(res.user.phoneNumber)) {
                    await handleSaveChanges('phone', selectedCountry ? `+${selectedCountry?.phone}${phoneNumber}` : '')
                    const updateUserInfo = JSON.parse(localStorage.getItem('userInfo'));

                    updateUserInfo.phone = `+${selectedCountry?.phone}${phoneNumber}` || userInfo.phone;

                    localStorage.setItem('userInfo', JSON.stringify(updateUserInfo));

                    document.querySelector('#phone-display').textContent = `+${selectedCountry?.phone}${phoneNumber}` || userInfo.phone;
                    handleToggleEditDiv('isEditContinueWithPhone');
                    setIsSaveLoading(false);
                }
                else {
                    let res = await axios.get(API_GET_USER_INFO,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                            }
                        });
                    localStorage.setItem('userInfo', JSON.stringify(res.data))
                }
            }).catch((err) => {
                console.error("Sai mã otp", err)
                setValidOTP(true);
                setIsSaveLoading(false);
            })
    }

    const [isOverLayVerifyIdentification, setIsOverLayVerifyIdentification] = useState(false);

    const toggleVerifyIdentification = () => {
        setIsOverLayVerifyIdentification(!isOverLayVerifyIdentification)
    }

    const [selectedCountry, setSelectedCountry] = useState({ code: 'VN', label: 'Vietnam', phone: '84' });

    const handleChange = (event, value) => {
        setSelectedCountry(value);
    };

    const countries = [
        { code: 'AD', label: 'Andorra', phone: '376' },
        {
            code: 'AE',
            label: 'United Arab Emirates',
            phone: '971',
        },
        { code: 'AF', label: 'Afghanistan', phone: '93' },
        {
            code: 'AG',
            label: 'Antigua and Barbuda',
            phone: '1-268',
        },
        { code: 'AI', label: 'Anguilla', phone: '1-264' },
        { code: 'AL', label: 'Albania', phone: '355' },
        { code: 'AM', label: 'Armenia', phone: '374' },
        { code: 'AO', label: 'Angola', phone: '244' },
        { code: 'AQ', label: 'Antarctica', phone: '672' },
        { code: 'AR', label: 'Argentina', phone: '54' },
        { code: 'AS', label: 'American Samoa', phone: '1-684' },
        { code: 'AT', label: 'Austria', phone: '43' },
        {
            code: 'AU',
            label: 'Australia',
            phone: '61',
            suggested: true,
        },
        { code: 'AW', label: 'Aruba', phone: '297' },
        { code: 'AX', label: 'Alland Islands', phone: '358' },
        { code: 'AZ', label: 'Azerbaijan', phone: '994' },
        {
            code: 'BA',
            label: 'Bosnia and Herzegovina',
            phone: '387',
        },
        { code: 'BB', label: 'Barbados', phone: '1-246' },
        { code: 'BD', label: 'Bangladesh', phone: '880' },
        { code: 'BE', label: 'Belgium', phone: '32' },
        { code: 'BF', label: 'Burkina Faso', phone: '226' },
        { code: 'BG', label: 'Bulgaria', phone: '359' },
        { code: 'BH', label: 'Bahrain', phone: '973' },
        { code: 'BI', label: 'Burundi', phone: '257' },
        { code: 'BJ', label: 'Benin', phone: '229' },
        { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
        { code: 'BM', label: 'Bermuda', phone: '1-441' },
        { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
        { code: 'BO', label: 'Bolivia', phone: '591' },
        { code: 'BR', label: 'Brazil', phone: '55' },
        { code: 'BS', label: 'Bahamas', phone: '1-242' },
        { code: 'BT', label: 'Bhutan', phone: '975' },
        { code: 'BV', label: 'Bouvet Island', phone: '47' },
        { code: 'BW', label: 'Botswana', phone: '267' },
        { code: 'BY', label: 'Belarus', phone: '375' },
        { code: 'BZ', label: 'Belize', phone: '501' },
        {
            code: 'CA',
            label: 'Canada',
            phone: '1',
            suggested: true,
        },
        {
            code: 'CC',
            label: 'Cocos (Keeling) Islands',
            phone: '61',
        },
        {
            code: 'CD',
            label: 'Congo, Democratic Republic of the',
            phone: '243',
        },
        {
            code: 'CF',
            label: 'Central African Republic',
            phone: '236',
        },
        {
            code: 'CG',
            label: 'Congo, Republic of the',
            phone: '242',
        },
        { code: 'CH', label: 'Switzerland', phone: '41' },
        { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
        { code: 'CK', label: 'Cook Islands', phone: '682' },
        { code: 'CL', label: 'Chile', phone: '56' },
        { code: 'CM', label: 'Cameroon', phone: '237' },
        { code: 'CN', label: 'China', phone: '86' },
        { code: 'CO', label: 'Colombia', phone: '57' },
        { code: 'CR', label: 'Costa Rica', phone: '506' },
        { code: 'CU', label: 'Cuba', phone: '53' },
        { code: 'CV', label: 'Cape Verde', phone: '238' },
        { code: 'CW', label: 'Curacao', phone: '599' },
        { code: 'CX', label: 'Christmas Island', phone: '61' },
        { code: 'CY', label: 'Cyprus', phone: '357' },
        { code: 'CZ', label: 'Czech Republic', phone: '420' },
        {
            code: 'DE',
            label: 'Germany',
            phone: '49',
            suggested: true,
        },
        { code: 'DJ', label: 'Djibouti', phone: '253' },
        { code: 'DK', label: 'Denmark', phone: '45' },
        { code: 'DM', label: 'Dominica', phone: '1-767' },
        {
            code: 'DO',
            label: 'Dominican Republic',
            phone: '1-809',
        },
        { code: 'DZ', label: 'Algeria', phone: '213' },
        { code: 'EC', label: 'Ecuador', phone: '593' },
        { code: 'EE', label: 'Estonia', phone: '372' },
        { code: 'EG', label: 'Egypt', phone: '20' },
        { code: 'EH', label: 'Western Sahara', phone: '212' },
        { code: 'ER', label: 'Eritrea', phone: '291' },
        { code: 'ES', label: 'Spain', phone: '34' },
        { code: 'ET', label: 'Ethiopia', phone: '251' },
        { code: 'FI', label: 'Finland', phone: '358' },
        { code: 'FJ', label: 'Fiji', phone: '679' },
        {
            code: 'FK',
            label: 'Falkland Islands (Malvinas)',
            phone: '500',
        },
        {
            code: 'FM',
            label: 'Micronesia, Federated States of',
            phone: '691',
        },
        { code: 'FO', label: 'Faroe Islands', phone: '298' },
        {
            code: 'FR',
            label: 'France',
            phone: '33',
            suggested: true,
        },
        { code: 'GA', label: 'Gabon', phone: '241' },
        { code: 'GB', label: 'United Kingdom', phone: '44' },
        { code: 'GD', label: 'Grenada', phone: '1-473' },
        { code: 'GE', label: 'Georgia', phone: '995' },
        { code: 'GF', label: 'French Guiana', phone: '594' },
        { code: 'GG', label: 'Guernsey', phone: '44' },
        { code: 'GH', label: 'Ghana', phone: '233' },
        { code: 'GI', label: 'Gibraltar', phone: '350' },
        { code: 'GL', label: 'Greenland', phone: '299' },
        { code: 'GM', label: 'Gambia', phone: '220' },
        { code: 'GN', label: 'Guinea', phone: '224' },
        { code: 'GP', label: 'Guadeloupe', phone: '590' },
        { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
        { code: 'GR', label: 'Greece', phone: '30' },
        {
            code: 'GS',
            label: 'South Georgia and the South Sandwich Islands',
            phone: '500',
        },
        { code: 'GT', label: 'Guatemala', phone: '502' },
        { code: 'GU', label: 'Guam', phone: '1-671' },
        { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
        { code: 'GY', label: 'Guyana', phone: '592' },
        { code: 'HK', label: 'Hong Kong', phone: '852' },
        {
            code: 'HM',
            label: 'Heard Island and McDonald Islands',
            phone: '672',
        },
        { code: 'HN', label: 'Honduras', phone: '504' },
        { code: 'HR', label: 'Croatia', phone: '385' },
        { code: 'HT', label: 'Haiti', phone: '509' },
        { code: 'HU', label: 'Hungary', phone: '36' },
        { code: 'ID', label: 'Indonesia', phone: '62' },
        { code: 'IE', label: 'Ireland', phone: '353' },
        { code: 'IL', label: 'Israel', phone: '972' },
        { code: 'IM', label: 'Isle of Man', phone: '44' },
        { code: 'IN', label: 'India', phone: '91' },
        {
            code: 'IO',
            label: 'British Indian Ocean Territory',
            phone: '246',
        },
        { code: 'IQ', label: 'Iraq', phone: '964' },
        {
            code: 'IR',
            label: 'Iran, Islamic Republic of',
            phone: '98',
        },
        { code: 'IS', label: 'Iceland', phone: '354' },
        { code: 'IT', label: 'Italy', phone: '39' },
        { code: 'JE', label: 'Jersey', phone: '44' },
        { code: 'JM', label: 'Jamaica', phone: '1-876' },
        { code: 'JO', label: 'Jordan', phone: '962' },
        {
            code: 'JP',
            label: 'Japan',
            phone: '81',
            suggested: true,
        },
        { code: 'KE', label: 'Kenya', phone: '254' },
        { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
        { code: 'KH', label: 'Cambodia', phone: '855' },
        { code: 'KI', label: 'Kiribati', phone: '686' },
        { code: 'KM', label: 'Comoros', phone: '269' },
        {
            code: 'KN',
            label: 'Saint Kitts and Nevis',
            phone: '1-869',
        },
        {
            code: 'KP',
            label: "Korea, Democratic People's Republic of",
            phone: '850',
        },
        { code: 'KR', label: 'Korea, Republic of', phone: '82' },
        { code: 'KW', label: 'Kuwait', phone: '965' },
        { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
        { code: 'KZ', label: 'Kazakhstan', phone: '7' },
        {
            code: 'LA',
            label: "Lao People's Democratic Republic",
            phone: '856',
        },
        { code: 'LB', label: 'Lebanon', phone: '961' },
        { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
        { code: 'LI', label: 'Liechtenstein', phone: '423' },
        { code: 'LK', label: 'Sri Lanka', phone: '94' },
        { code: 'LR', label: 'Liberia', phone: '231' },
        { code: 'LS', label: 'Lesotho', phone: '266' },
        { code: 'LT', label: 'Lithuania', phone: '370' },
        { code: 'LU', label: 'Luxembourg', phone: '352' },
        { code: 'LV', label: 'Latvia', phone: '371' },
        { code: 'LY', label: 'Libya', phone: '218' },
        { code: 'MA', label: 'Morocco', phone: '212' },
        { code: 'MC', label: 'Monaco', phone: '377' },
        {
            code: 'MD',
            label: 'Moldova, Republic of',
            phone: '373',
        },
        { code: 'ME', label: 'Montenegro', phone: '382' },
        {
            code: 'MF',
            label: 'Saint Martin (French part)',
            phone: '590',
        },
        { code: 'MG', label: 'Madagascar', phone: '261' },
        { code: 'MH', label: 'Marshall Islands', phone: '692' },
        {
            code: 'MK',
            label: 'Macedonia, the Former Yugoslav Republic of',
            phone: '389',
        },
        { code: 'ML', label: 'Mali', phone: '223' },
        { code: 'MM', label: 'Myanmar', phone: '95' },
        { code: 'MN', label: 'Mongolia', phone: '976' },
        { code: 'MO', label: 'Macao', phone: '853' },
        {
            code: 'MP',
            label: 'Northern Mariana Islands',
            phone: '1-670',
        },
        { code: 'MQ', label: 'Martinique', phone: '596' },
        { code: 'MR', label: 'Mauritania', phone: '222' },
        { code: 'MS', label: 'Montserrat', phone: '1-664' },
        { code: 'MT', label: 'Malta', phone: '356' },
        { code: 'MU', label: 'Mauritius', phone: '230' },
        { code: 'MV', label: 'Maldives', phone: '960' },
        { code: 'MW', label: 'Malawi', phone: '265' },
        { code: 'MX', label: 'Mexico', phone: '52' },
        { code: 'MY', label: 'Malaysia', phone: '60' },
        { code: 'MZ', label: 'Mozambique', phone: '258' },
        { code: 'NA', label: 'Namibia', phone: '264' },
        { code: 'NC', label: 'New Caledonia', phone: '687' },
        { code: 'NE', label: 'Niger', phone: '227' },
        { code: 'NF', label: 'Norfolk Island', phone: '672' },
        { code: 'NG', label: 'Nigeria', phone: '234' },
        { code: 'NI', label: 'Nicaragua', phone: '505' },
        { code: 'NL', label: 'Netherlands', phone: '31' },
        { code: 'NO', label: 'Norway', phone: '47' },
        { code: 'NP', label: 'Nepal', phone: '977' },
        { code: 'NR', label: 'Nauru', phone: '674' },
        { code: 'NU', label: 'Niue', phone: '683' },
        { code: 'NZ', label: 'New Zealand', phone: '64' },
        { code: 'OM', label: 'Oman', phone: '968' },
        { code: 'PA', label: 'Panama', phone: '507' },
        { code: 'PE', label: 'Peru', phone: '51' },
        { code: 'PF', label: 'French Polynesia', phone: '689' },
        { code: 'PG', label: 'Papua New Guinea', phone: '675' },
        { code: 'PH', label: 'Philippines', phone: '63' },
        { code: 'PK', label: 'Pakistan', phone: '92' },
        { code: 'PL', label: 'Poland', phone: '48' },
        {
            code: 'PM',
            label: 'Saint Pierre and Miquelon',
            phone: '508',
        },
        { code: 'PN', label: 'Pitcairn', phone: '870' },
        { code: 'PR', label: 'Puerto Rico', phone: '1' },
        {
            code: 'PS',
            label: 'Palestine, State of',
            phone: '970',
        },
        { code: 'PT', label: 'Portugal', phone: '351' },
        { code: 'PW', label: 'Palau', phone: '680' },
        { code: 'PY', label: 'Paraguay', phone: '595' },
        { code: 'QA', label: 'Qatar', phone: '974' },
        { code: 'RE', label: 'Reunion', phone: '262' },
        { code: 'RO', label: 'Romania', phone: '40' },
        { code: 'RS', label: 'Serbia', phone: '381' },
        { code: 'RU', label: 'Russian Federation', phone: '7' },
        { code: 'RW', label: 'Rwanda', phone: '250' },
        { code: 'SA', label: 'Saudi Arabia', phone: '966' },
        { code: 'SB', label: 'Solomon Islands', phone: '677' },
        { code: 'SC', label: 'Seychelles', phone: '248' },
        { code: 'SD', label: 'Sudan', phone: '249' },
        { code: 'SE', label: 'Sweden', phone: '46' },
        { code: 'SG', label: 'Singapore', phone: '65' },
        { code: 'SH', label: 'Saint Helena', phone: '290' },
        { code: 'SI', label: 'Slovenia', phone: '386' },
        {
            code: 'SJ',
            label: 'Svalbard and Jan Mayen',
            phone: '47',
        },
        { code: 'SK', label: 'Slovakia', phone: '421' },
        { code: 'SL', label: 'Sierra Leone', phone: '232' },
        { code: 'SM', label: 'San Marino', phone: '378' },
        { code: 'SN', label: 'Senegal', phone: '221' },
        { code: 'SO', label: 'Somalia', phone: '252' },
        { code: 'SR', label: 'Suriname', phone: '597' },
        { code: 'SS', label: 'South Sudan', phone: '211' },
        {
            code: 'ST',
            label: 'Sao Tome and Principe',
            phone: '239',
        },
        { code: 'SV', label: 'El Salvador', phone: '503' },
        {
            code: 'SX',
            label: 'Sint Maarten (Dutch part)',
            phone: '1-721',
        },
        {
            code: 'SY',
            label: 'Syrian Arab Republic',
            phone: '963',
        },
        { code: 'SZ', label: 'Swaziland', phone: '268' },
        {
            code: 'TC',
            label: 'Turks and Caicos Islands',
            phone: '1-649',
        },
        { code: 'TD', label: 'Chad', phone: '235' },
        {
            code: 'TF',
            label: 'French Southern Territories',
            phone: '262',
        },
        { code: 'TG', label: 'Togo', phone: '228' },
        { code: 'TH', label: 'Thailand', phone: '66' },
        { code: 'TJ', label: 'Tajikistan', phone: '992' },
        { code: 'TK', label: 'Tokelau', phone: '690' },
        { code: 'TL', label: 'Timor-Leste', phone: '670' },
        { code: 'TM', label: 'Turkmenistan', phone: '993' },
        { code: 'TN', label: 'Tunisia', phone: '216' },
        { code: 'TO', label: 'Tonga', phone: '676' },
        { code: 'TR', label: 'Turkey', phone: '90' },
        {
            code: 'TT',
            label: 'Trinidad and Tobago',
            phone: '1-868',
        },
        { code: 'TV', label: 'Tuvalu', phone: '688' },
        {
            code: 'TW',
            label: 'Taiwan, Republic of China',
            phone: '886',
        },
        {
            code: 'TZ',
            label: 'United Republic of Tanzania',
            phone: '255',
        },
        { code: 'UA', label: 'Ukraine', phone: '380' },
        { code: 'UG', label: 'Uganda', phone: '256' },
        {
            code: 'US',
            label: 'United States',
            phone: '1',
            suggested: true,
        },
        { code: 'UY', label: 'Uruguay', phone: '598' },
        { code: 'UZ', label: 'Uzbekistan', phone: '998' },
        {
            code: 'VA',
            label: 'Holy See (Vatican City State)',
            phone: '379',
        },
        {
            code: 'VC',
            label: 'Saint Vincent and the Grenadines',
            phone: '1-784',
        },
        { code: 'VE', label: 'Venezuela', phone: '58' },
        {
            code: 'VG',
            label: 'British Virgin Islands',
            phone: '1-284',
        },
        {
            code: 'VI',
            label: 'US Virgin Islands',
            phone: '1-340',
        },
        { code: 'VN', label: 'Vietnam', phone: '84' },
        { code: 'VU', label: 'Vanuatu', phone: '678' },
        { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
        { code: 'WS', label: 'Samoa', phone: '685' },
        { code: 'XK', label: 'Kosovo', phone: '383' },
        { code: 'YE', label: 'Yemen', phone: '967' },
        { code: 'YT', label: 'Mayotte', phone: '262' },
        { code: 'ZA', label: 'South Africa', phone: '27' },
        { code: 'ZM', label: 'Zambia', phone: '260' },
        { code: 'ZW', label: 'Zimbabwe', phone: '263' },
    ];



    return (
        <>
            <HeaderFormUser />
            <div className='div-account-setting-form-user'>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link className='a-tag-footer-div-form-user' to={'/account-settings'}>
                            <h2>Tài khoản &nbsp;  </h2>
                        </Link>
                        <i className="fa-solid fa-angle-right"></i>
                        <h2> &nbsp; Thông tin cá nhân</h2>
                    </div>
                    <h1>Thông tin cá nhân</h1>
                </div>
                <div className='container-personal-info'>
                    <div className='div-left-personal-info'
                        style={{ opacity: (editState.isEditNameOpen || editState.isEditEmailOpen || editState.isEditPhoneOpen || editState.isEditContinueWithPhone) ? 0.2 : 1 }}
                    >
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Tên pháp lý</h2>
                                <p id='name-display'>{userInfo && userInfo.firstName} {userInfo && userInfo.lastName}</p>
                            </div>
                            <div>
                                <h3 onClick={() => handleToggleEditDiv('isEditNameOpen')}
                                    className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Địa chỉ email</h2>
                                <p id='email-display'>{hiddenEmail && hiddenEmail}</p>
                            </div>
                            <div>
                                <h3 onClick={() => handleToggleEditDiv('isEditEmailOpen')}
                                    className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Số điện thoại</h2>
                                <p id='phone-display'>{hiddenPhone}</p>
                                <p>Số điện thoại liên hệ (để khách đã xác nhận và Airbnb liên hệ). Bạn có thể thêm các số điện thoại khác và chọn mục đích sử dụng tương ứng.</p>
                            </div>
                            <div>
                                <h3 onClick={() => handleToggleEditDiv('isEditPhoneOpen')}
                                    className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />

                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Giấy tờ tùy thân do chính phủ cấp</h2>
                                {
                                    userInfo.identity ? (
                                        <p>Đã xác minh</p>
                                    ) : (
                                        <p>Chưa được cung cấp</p>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    userInfo.identity ? (
                                        <h3 onClick={toggleVerifyIdentification}
                                            className='edit-tag-personal-info'>Xem</h3>
                                    ) : (
                                        <Link className='link-to-choice-account-setting' to={'/identity-verification'}>
                                            <h3 className='edit-tag-personal-info'>Thêm</h3>
                                        </Link>
                                    )
                                }
                            </div>
                            {(
                                <div className={`overlay2 ${isOverLayVerifyIdentification ? '' : 'd-none'}`} >
                                    <div className={`appearing-div ${isOverLayVerifyIdentification ? 'active' : ''}`}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <i style={{ marginRight: '20%' }}
                                                onClick={toggleVerifyIdentification} className="fa-solid fa-chevron-left close-description" ></i>
                                            <h2>Giấy tờ tuỳ thân của bạn</h2>
                                        </div>
                                        <hr />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5%' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img className='img-display-on-verify-identity' src={userInfo.identity && userInfo.identity.srcImgFrontSide} alt="" />
                                                <h4>Ảnh mặt trước</h4>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img className='img-display-on-verify-identity' src={userInfo.identity && userInfo.identity.srcImgBackSide} alt="" />
                                                <h4>Ảnh mặt sau</h4>
                                            </div>
                                        </div>
                                        <hr />
                                        <div style={{ textAlign: 'end' }}>
                                            <Link className='link-to-choice-account-setting' to={'/identity-verification'}>
                                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Địa chỉ</h2>
                                <p>Chưa được cung cấp</p></div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Liên hệ trong trường hợp khẩn cấp</h2>
                                <p>Chưa được cung cấp</p></div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                    </div>
                    {
                        editState.isEditNameOpen && (
                            <div className='div-edit-first-last-name'>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h2>Tên pháp lý</h2>
                                        <p>Đây là tên trên giấy tờ thông hành của bạn, có thể là giấy phép hoặc hộ chiếu.</p>
                                    </div>
                                    <div className='cancel-edit'
                                        onClick={() => {
                                            handleToggleEditDiv('isEditNameOpen');
                                            handleCancel();
                                            resetEmpty();
                                        }}
                                    >Huỷ</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div className={`div-edit-name-detail 
                                    ${selectedDiv === 'firstName' && isEmpty.firstName ? 'div-name-edit-empty-selected' :
                                            selectedDiv === 'firstName' ? 'div-name-edit-selected' : ''}
                                    `}
                                        onClick={() => handleDivClick('firstName')}
                                    >
                                        <div className='div-edit-detail-first-last-name'>
                                            <h3 style={{ marginBottom: '3%' }}>Tên</h3>
                                            <input className='input-edit-first-last-name'
                                                type="text"
                                                value={tempFirstName}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    setTempFirstName(value);
                                                    handleInputChange('firstName', value);
                                                    checkEmpty('firstName', value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={`div-edit-name-detail 
                                    ${selectedDiv === 'lastName' && isEmpty.lastName ? 'div-name-edit-empty-selected' :
                                            selectedDiv === 'lastName' ? 'div-name-edit-selected' : ''}
                                    `}
                                        onClick={() => handleDivClick('lastName')}
                                    >
                                        <div className='div-edit-detail-first-last-name'>
                                            <h3 style={{ marginBottom: '3%' }}>Họ</h3>
                                            <input className='input-edit-first-last-name'
                                                type="text"
                                                value={tempLastName}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setTempLastName(value);
                                                    handleInputChange('lastName', value);
                                                    checkEmpty('lastName', value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {isEmpty.firstName && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Bắt buộc phải điền tên</p>}
                                    {isEmpty.lastName && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Bắt buộc phải điền họ</p>}
                                    {
                                        isSaveLoading ? (
                                            <div className="loadingio-spinner-ellipsis-ilx1jirdsl"><div className="ldio-qk6putkpoq">
                                                <div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) : (
                                            <button onClick={() =>
                                                handleButtonClick()}
                                                className={`btn-save-edit ${saveDisabled.editName ? 'btn-edit-name-disabled' : ''}`}
                                                disabled={saveDisabled.editName}
                                            >Lưu</button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        editState.isEditEmailOpen && (
                            <div className='div-edit-email'>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h2>Địa chỉ email</h2>
                                        <p>Sử dụng địa chỉ mà bạn luôn có quyền truy cập.</p>
                                    </div>
                                    <div className='cancel-edit'
                                        onClick={() => {
                                            handleToggleEditDiv('isEditEmailOpen');
                                            handleCancel();
                                            resetEmpty();
                                        }}
                                    >Huỷ</div>
                                </div>
                                <div className={`div-edit-email-detail 
                                        ${selectedDiv === 'email' && isEmpty.email ? 'div-email-edit-empty-selected' :
                                        selectedDiv === 'email' ? 'div-email-edit-selected' : ''}
                                        `}
                                    onClick={() => handleDivClick('email')}
                                >
                                    <div className='div-edit-detail-email'>
                                        <h3 style={{ marginBottom: '3%' }}>Email</h3>
                                        <input className='input-edit-first-last-name'
                                            type="text"
                                            value={tempEmail}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setTempEmail(value);
                                                handleInputChange('email', value);
                                                checkEmpty('email', value);
                                                setIsEmailValid(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    {!isEmailValid && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Địa chỉ email không hợp lệ</p>}
                                    {isEmpty.email && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Địa chỉ email không được để trống</p>}
                                    {
                                        isSaveLoading ? (
                                            <div className="loadingio-spinner-ellipsis-ilx1jirdsl"><div className="ldio-qk6putkpoq">
                                                <div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) : (
                                            <button onClick={
                                                () =>
                                                    handleButtonClick()
                                            }
                                                className={`btn-save-edit ${saveDisabled.editEmail ? 'btn-edit-name-disabled' : ''}`}
                                                disabled={saveDisabled.editEmail}
                                            >Lưu</button>
                                        )
                                    }

                                </div>
                            </div>
                        )
                    }
                    {
                        editState.isEditPhoneOpen && (
                            <div className='div-edit-phone'>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h2>Số điện thoại</h2>
                                        <p>Số điện thoại liên hệ (để khách đã xác nhận và Airbnb liên hệ). Bạn có thể thêm các số điện thoại khác và chọn mục đích sử dụng tương ứng.</p>
                                    </div>
                                    <div className='cancel-edit'
                                        onClick={() => {
                                            handleToggleEditDiv('isEditPhoneOpen');
                                            handleCancel();
                                            resetEmpty();
                                        }}
                                    >Huỷ</div>
                                </div>
                                {/* <div className={`div-edit-email-detail 
                                        ${selectedDiv === 'email' && isEmpty.email ? 'div-email-edit-empty-selected' :
                                        selectedDiv === 'email' ? 'div-email-edit-selected' : ''}
                                        `}
                                    onClick={() => handleDivClick('email')}
                                >
                                    <div className='div-edit-detail-email'>
                                        <h3 style={{ marginBottom: '3%' }}>Email</h3>
                                        <input className='input-edit-first-last-name'
                                            type="text"
                                            value={tempEmail}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setTempEmail(value);
                                                handleInputChange('email', value);
                                                checkEmpty('email', value);
                                                setIsEmailValid(true);
                                            }}
                                        />
                                    </div>
                                </div> */}
                                <Autocomplete
                                    id="country-select-demo"
                                    sx={{ width: 300 }}
                                    options={countries}
                                    autoHighlight
                                    getOptionLabel={(option) => ` ${option.label} (+${option.phone})`}
                                    value={selectedCountry}
                                    onChange={handleChange}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                alt=""
                                            />
                                            {option.label} ({option.code}) +{option.phone}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Quốc gia/Khu vực"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                                <Box
                                    component="form"
                                    noValidate
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { sm: '1fr 1fr' },
                                        gap: 2,
                                    }}
                                >
                                    <ValidationTextField
                                        label="Số điện thoại"
                                        required
                                        variant="outlined"
                                        // defaultValue="Success"
                                        id="validation-outlined-input"
                                        defaultValue={selectedCountry ? `(+${selectedCountry?.phone}) ${phoneNumber}` : ''}
                                        onBlur={(e) => {
                                            const newValue = e.target.value.replace(`(+${selectedCountry?.phone})`, '').trim();
                                            setPhoneNumber(newValue);
                                            setIdentifiedPhone(false)
                                        }}
                                    />
                                </Box>
                                <div>
                                    {identifiedPhone && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Số điện thoại này đã xác minh</p>}
                                    {
                                        isSaveLoading ? (
                                            <div className="loadingio-spinner-ellipsis-ilx1jirdsl"><div className="ldio-qk6putkpoq">
                                                <div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) : (
                                            <button onClick={
                                                () =>
                                                    onSignup()}
                                                className={`btn-save-edit ${saveDisabled.editEmail ? 'btn-edit-name-disabled' : ''}`}
                                                disabled={saveDisabled.editEmail}
                                            >Xác minh</button>
                                        )
                                    }
                                    <div id="recaptcha-container" />
                                </div>
                            </div>
                        )
                    }

                    {
                        editState.isEditContinueWithPhone && (
                            <div className='div-edit-continue-with-phone'>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h2>Nhập mã bảo mật của bạn</h2>
                                        <p>Nhập mã gồm 6 chữ số mà Airbnb vừa gửi tới số {selectedCountry ? `(+${selectedCountry.phone})` : ''} {phoneNumber}</p>
                                    </div>
                                    <div className='cancel-edit'
                                        onClick={() => {
                                            handleToggleEditDiv('isEditContinueWithPhone')
                                            handleToggleEditDiv('isEditPhoneOpen');
                                            handleCancel();
                                            resetEmpty();
                                        }}
                                    >Huỷ</div>
                                </div>
                                <div className={`div-edit-name-detail 
                                    ${validOTP ? 'div-error-edit' :
                                        selectedDiv === 'firstName' && isEmpty.firstName ? 'div-name-edit-empty-selected' :
                                            selectedDiv === 'firstName' ? 'div-name-edit-selected' : ''}
                                    `}
                                    onClick={() => handleDivClick('firstName')}
                                >
                                    <div className='div-edit-detail-first-last-name'>
                                        <h3 style={{ marginBottom: '3%' }}>OTP</h3>
                                        <input className='input-edit-first-last-name'
                                            maxLength={6}
                                            placeholder='- - - - - -'
                                            type="tel"
                                            value={valueOTP} onChange={(e) => {
                                                setValueOTP(e?.target?.value);
                                                setValidOTP(false);
                                                handleCheckOTPInput(e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    {checkEmptyOTP && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Nhập mã OTP để xác thực</p>}

                                    {validOTP && <p className="error-message"><i className="fa-solid fa-circle-exclamation"></i> Mã không chính xác. Vui lòng thử lại</p>}
                                    {
                                        isSaveLoading ? (
                                            <div className="loadingio-spinner-ellipsis-ilx1jirdsl"><div className="ldio-qk6putkpoq">
                                                <div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) : (
                                            <button onClick={() =>
                                                onOTPVerify()}
                                                className={`btn-save-edit ${checkEmptyOTP || valueOTP.length !== 6 ? 'btn-edit-name-disabled' : ''}`}
                                                disabled={checkEmptyOTP || valueOTP.length !== 6}
                                            >Tiếp tục</button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }




                    <div className='div-right-personal-info'>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g><g stroke="none"><path d="M27 5l.585.005c4.29.076 8.837.984 13.645 2.737l.77.288V35.4l-.008.13a1 1 0 0 1-.47.724l-.116.06L27 42.716V25a1 1 0 0 0-.883-.993L26 24H12V8.029l.77-.286c4.797-1.75 9.336-2.658 13.62-2.737L27 5z" fillOpacity=".2"></path><path d="M27 1c5.599 0 11.518 1.275 17.755 3.816a2 2 0 0 1 1.239 1.691L46 6.67V35.4a5 5 0 0 1-2.764 4.472l-.205.097-15.594 6.93L27 47l-2.461-1h2.451a.01.01 0 0 0 .007-.003L27 45.99v-1.085l15.218-6.763a3 3 0 0 0 1.757-2.351l.019-.194.006-.196V6.669l-.692-.278C37.557 4.128 32.121 3 27 3S16.443 4.128 10.692 6.391L10 6.67 9.999 24H8V6.669a2 2 0 0 1 1.098-1.786l.147-.067C15.483 2.275 21.401 1 27 1z"></path></g><g fill="none" strokeWidth="2"><path d="M4 24h22a1 1 0 0 1 1 1v20.99a.01.01 0 0 1-.01.01H4a1 1 0 0 1-1-1V25a1 1 0 0 1 1-1z"></path><path d="M21 25v-5a6 6 0 1 0-12 0v5"></path><circle cx="15" cy="35" r="2"></circle></g></g></svg>
                            <h2>Tại sao thông tin của tôi không được hiển thị ở đây?</h2>
                            <p className='p-tag-description-and-details'>Chúng tôi đang ẩn một số thông tin tài khoản để bảo vệ danh tính của bạn.</p>
                            <hr />
                        </div>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g stroke="none"><path d="m39 15.999v28.001h-30v-28.001z" fillOpacity=".2"></path><path d="m24 0c5.4292399 0 9.8479317 4.32667079 9.9961582 9.72009516l.0038418.27990484v2h7c1.0543618 0 1.9181651.8158778 1.9945143 1.8507377l.0054857.1492623v32c0 1.0543618-.8158778 1.9181651-1.8507377 1.9945143l-.1492623.0054857h-34c-1.0543618 0-1.91816512-.8158778-1.99451426-1.8507377l-.00548574-.1492623v-32c0-1.0543618.81587779-1.9181651 1.85073766-1.9945143l.14926234-.0054857h7v-2c0-5.5228475 4.4771525-10 10-10zm17 14h-34v32h34zm-17 14c1.6568542 0 3 1.3431458 3 3s-1.3431458 3-3 3-3-1.3431458-3-3 1.3431458-3 3-3zm0 2c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1 1-.4477153 1-1-.4477153-1-1-1zm0-28c-4.3349143 0-7.8645429 3.44783777-7.9961932 7.75082067l-.0038068.24917933v2h16v-2c0-4.418278-3.581722-8-8-8z"></path></g></svg>
                            <h2>Bạn có thể chỉnh sửa những thông tin nào?</h2>
                            <p className='p-tag-description-and-details'>Bạn có thể chỉnh sửa thông tin liên hệ và thông tin cá nhân. Nếu sử dụng thông tin này để xác minh danh tính, bạn sẽ cần phải xác minh lần nữa vào lần đặt tiếp theo, hoặc để tiếp tục đón tiếp khách.</p>
                            <hr />
                        </div>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g stroke="none"><path d="M24 9C14.946 9 7.125 15.065 4.74 23.591L4.63 24l.013.054c2.235 8.596 9.968 14.78 18.99 14.943L24 39c9.053 0 16.875-6.064 19.26-14.59l.11-.411-.013-.052c-2.234-8.597-9.968-14.78-18.99-14.944L24 9z" fillOpacity=".2"></path><path d="M24 5c11.18 0 20.794 7.705 23.346 18.413l.133.587-.133.587C44.794 35.295 35.181 43 24 43 12.82 43 3.206 35.295.654 24.588l-.133-.587.048-.216C2.985 12.884 12.69 5 24 5zm0 2C13.88 7 5.16 13.887 2.691 23.509l-.12.492.032.14c2.288 9.564 10.728 16.513 20.65 16.846l.377.01L24 41c10.243 0 19.052-7.056 21.397-16.861l.031-.14-.031-.138c-2.288-9.566-10.728-16.515-20.65-16.848l-.377-.01L24 7zm0 10a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path></g></svg>
                            <h2>Thông tin nào được chia sẻ với người khác?</h2>
                            <p className='p-tag-description-and-details'>Airbnb chỉ tiết lộ thông tin liên lạc cho Chủ nhà/Người tổ chức và khách sau khi đặt phòng/đặt chỗ được xác nhận.</p>
                        </div>
                    </div>
                </div>
            </div >
            <FooterFormUser />
        </>
    )
}

export default PersonalInfo