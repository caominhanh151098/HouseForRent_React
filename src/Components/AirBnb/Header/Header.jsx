import React, { useState, useEffect } from "react";
import "../AirBnb.css"
import FormHeader from "./FormHeader";
import CalenderPicker from "./CalenderPicker";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import axios from "axios";
import { API_GET_HOUSE_BY_CITY, API_GET_USER_INFO, API_USER_AUTH_URL } from './../../../Services/common';
import { useHouse } from "./HouseContext";
import _debounce from 'lodash.debounce';
import GradientButton from './../Detail/GradientButton';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import UserService from "../../../Services/UserService";
import { RecaptchaVerifier, sendSignInLinkToEmail, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../Hooks/FireBase.config";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { toggle } from "ionicons/icons";
import MyAxios from "../../../Services/MyAxios";

const schema = yup.object({
  firstName: yup.string().required("Bắt buộc điền tên."),
  lastName: yup.string().required("Bắt buộc phải điền họ."),
  // dob: yup.string().date().required("Chọn ngày sinh của bạn để tiếp tục."),
  dob: yup.string().required("Chọn ngày sinh của bạn để tiếp tục.").test('is-over-18', 'Bạn phải từ 18 tuổi trở lên để có thể dùng Airbnb. Những người khác sẽ không thấy được ngày sinh của bạn.', (value) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(currentDate.getFullYear() - 18);

    return (
      selectedDate instanceof Date &&
      !isNaN(selectedDate) &&
      selectedDate <= minAgeDate
    );
  }),
  email: yup.string().email("Nhập địa chỉ email hợp lệ.").required("Bắt buộc phải điền email.")
})

const Header = () => {
  const [showFormHeader, setShowFormHeader] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [isSelectAddGuests, setIsSlectAddGuests] = useState(false);
  const [isSelectChooseDay, setIsSelectChooseDay] = useState(false);
  const [isSelectBackDay, setIsSelectBackDay] = useState(false);
  const [countOld, setCountOld] = useState(0);
  const [countYoung, setCountYoung] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const [countPets, setCountPets] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpenDropMenuLogin, setIsOpenDropMenuLogin] = useState(false);
  const [isOpenDropMenuLoginWithJWT, setIsOpenDropMenuLoginWithJWT] = useState(false);
  const [isOverLayLoginForm, setIsOpenLayLoginForm] = useState(false);
  const [isOverLayContinueWithPhone, setIsOpenLayContinueWithPhone] = useState(false);
  const [isOverlayLoginSuccess, setIsOverlayLoginSuccess] = useState(false);
  const [isOverLayRegisterForm, setIsOverLayRegisterForm] = useState(false);
  const [isOverFormFinishRegister, setIsOverFormFinishRegister] = useState(false);
  const [isOverLayVerifyEmail, setIsOverLayVerifyEmail] = useState(false);
  const [isOverFormSuccess, setIsOverFormSuccess] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valueOTP, setValueOTP] = useState("");
  const [user, setUser] = useState({});
  // const [houseSearchByCity, setHouseSearchByCity] = useState([])

  const { register, formState: { errors }, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  const { status } = useParams();

  const handleAcceptRegistrationTermsAndCreateUser = async () => {
    await UserService.register(user);
    toggleVerifyEmailForm();
  }

  const handleCreateUser = (data) => {
    data = {
      ...data,
      phone: phoneNumber
    }
    console.log(data);
    setUser(data);
    toggleFormFinishRegister();
  }

  const handleVerifyEmail = () => {
    sendSignInLinkToEmail(auth, user?.email, {
      // this is the URL that we will redirect back to after clicking on the link in mailbox
      url: 'http://localhost:3000/verify/success',
      handleCodeInApp: true,
    }).then(() => {
      console.log("Đã gửi mail để verify");
    }).catch(err => {
      console.log("LỖI! không gửi được " + user?.email);
    })
    toggleFormSuccess();
  }

  const jwtValue = localStorage.getItem("jwt");

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [render, setRender] = useState(false);

  useEffect(() => {
    console.log("welcoming", userInfo);
  }, [userInfo])

  useEffect(() => {
    async function verifyEmail() {
      const resp = await MyAxios.axiosWithHeader(API_USER_AUTH_URL).post("/verify-email");
      if (resp.data) {
        toggleFormSuccess();
      }
    }
    if (status == "success")
      verifyEmail();
  }, [])

  const navigate = useNavigate();

  const API_URL = 'https://nominatim.openstreetmap.org/search';

  const { setHouseSearchByCity, setLoadingSearchByCity } = useHouse();

  const handleInputChangee = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    await debounceGenerateSuggestions(value);
  };

  const debounceGenerateSuggestions = _debounce(async (value) => {
    if (value.trim() !== '') {
      const suggestionsList = await generateSuggestions(value);
      if (suggestionsList.length > 0) {
        setSuggestions(suggestionsList);
      }
      setIsSelectLocation(false);
      console.log(suggestions);
    } else {
      setSuggestions([]);
    }
  }, 1000);

  const generateSuggestions = async (value) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: value,
          format: 'json',
        },
      });

      const locations = Array.from(new Set(response.data.map(result => result.display_name.split(',')[0])));
      console.log(locations);
      return locations;

    } catch (error) {
      console.error('Error fetching location suggestions', error);
      return [];
    }
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setInputValue(region);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedRegion(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };



  const increaseOld = () => {
    setCountOld((prevCount) => prevCount + 1)
  }
  const decreaseOld = () => {
    if (countOld > 0) {
      setCountOld((prevCount) => prevCount - 1)
    }
  }

  const increaseYoung = () => {
    setCountYoung((prevCount) => prevCount + 1)
  }
  const decreaseYoung = () => {
    if (countYoung > 0) {
      setCountYoung((prevCount) => prevCount - 1)
    }
  }

  const increaseBaby = () => {
    setCountBaby((prevCount) => prevCount + 1)
  }
  const decreaseBaby = () => {
    if (countBaby > 0) {
      setCountBaby((prevCount) => prevCount - 1)
    }
  }

  const increasePets = () => {
    setCountPets((prevCount) => prevCount + 1)
  }
  const decreasePets = () => {
    if (countPets > 0) {
      setCountPets((prevCount) => prevCount - 1)
    }
  }

  const handleSelectChooseDay = () => {
    setIsSelectChooseDay(true)
    setIsSelectLocation(false)
    setIsSlectAddGuests(false)
    setIsSelectBackDay(false)
  }

  const handleSelectAddGuests = () => {
    setIsSlectAddGuests(true)
    setIsSelectLocation(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleSelectLocation = () => {
    if (suggestions.length === 0) {
      setIsSelectLocation(true)
    }
    setIsSlectAddGuests(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleShowFormHeader = () => {
    setShowFormHeader(true);
    setIsSelectLocation(false)
    setIsSlectAddGuests(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleSearchButtonClick = () => {
    setLoadingSearchByCity(true)
    setTimeout(() => {
      if (inputValue) {
        axios.get(API_GET_HOUSE_BY_CITY + inputValue)
          .then(resp => {
            console.log(resp.data);
            setHouseSearchByCity(resp.data);
          })
          .catch(error => {
            console.error('Error fetching houses by city', error);
          })
      } else {
        console.log("Chưa chọn thành phố");
      }
      setLoadingSearchByCity(false)
    }, 1300)
    setShowFormHeader(prev => !prev)
  }
  // useEffect(() => {
  //   console.log("houseSearchByCity", houseSearchByCity);
  // }, [houseSearchByCity])

  const handleLogOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userWishLists');
    navigate('/loggout', { replace: true });
    window.location.reload();
  }

  const handleOpenMenuDropdownLoginWithJWT = () => {
    setIsOpenDropMenuLoginWithJWT(!isOpenDropMenuLoginWithJWT)
  }

  const handleOpenMenuDropdownLogin = () => {
    setIsOpenDropMenuLogin(!isOpenDropMenuLogin)
  }

  const toggleLoginForm = () => {
    setIsOpenLayLoginForm(!isOverLayLoginForm)
    if (isOpenDropMenuLogin) {
      setIsOpenDropMenuLogin(false)
    }
  }

  const toggleRegisterForm = () => {
    reset();
    setIsOverLayRegisterForm(!isOverLayRegisterForm)
    if (isOpenDropMenuLogin) {
      setIsOpenDropMenuLogin(false);
    }
    if (isOverLayLoginForm) {
      setIsOpenLayLoginForm(false);
    }
    if (isOverLayContinueWithPhone)
      setIsOpenLayContinueWithPhone(false);
  }

  const toggleFormFinishRegister = () => {
    setIsOverFormFinishRegister(!isOverFormFinishRegister)
    if (isOverLayRegisterForm)
      setIsOverLayRegisterForm(false);
  }

  const toggleVerifyEmailForm = () => {
    setIsOverLayVerifyEmail(!isOverLayVerifyEmail)
    if (isOverFormFinishRegister) {
      setIsOverFormFinishRegister(false);
    }
  }

  const toggleFormSuccess = () => {
    setIsOverFormSuccess(!isOverFormSuccess)
    if (isOverLayVerifyEmail) {
      setIsOverLayVerifyEmail(false);
    }
  }

  const toggleContinueWithPhone = () => {
    setIsOpenLayContinueWithPhone(!isOverLayContinueWithPhone)
    if (isOverLayLoginForm) {
      setIsOpenLayLoginForm(false)
    }
    if (!isOverLayLoginForm) {
      setIsOpenLayLoginForm(true)
    }
    if (jwtValue && jwtValue) {
      setIsOpenLayLoginForm(false);
    }
  }

  const toggleLoginSuccess = () => {
    if (isOverlayLoginSuccess) {
      setIsOverlayLoginSuccess(false)
    }
  }

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

  const isButtonDisabled = valueOTP && valueOTP.length !== 6;

  const [loadingSingup, setLoadingSingup] = useState(false);

  const onOTPVerify = async () => {
    setLoadingSingup(true);
    window.confirmationResult
      .confirm(valueOTP)
      .then(async (res) => {
        if (await UserService.loginUser(res.user.phoneNumber)) {
          setLoadingSingup(false);
          toggleRegisterForm();
        }
        else {
          setIsOpenLayLoginForm(false);
          if (isOverLayContinueWithPhone) {
            setIsOpenLayContinueWithPhone(false);
          }
          let res = await axios.get(API_GET_USER_INFO,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
              }
            });
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          setLoadingSingup(false);
          setIsOverlayLoginSuccess(true);
        }
      }).catch((err) => {
        console.log(err)
        setLoadingSingup(false);
      })
  }



  const onSignup = () => {
    setLoadingSingup(true);
    onCaptchVerify();
    const appVerifier = window.applicationVerifier
    const phone = "+" + selectedCountry?.phone + phoneNumber;
    console.log(phone);
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        toggleContinueWithPhone();
        setLoadingSingup(false);
      }).catch((error) => {
        console.log(error);
        setLoadingSingup(false);
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

  const handleChange = (event, value) => {
    setSelectedCountry(value);
  };


  if (userInfo) {
    console.log("Giá trị userInfo được tìm thấy: " + userInfo);
  } else {
    console.log("Không có giá trị userInfo trong Local Storage.");
  }

  if (jwtValue) {
    console.log("Giá trị jwt được tìm thấy: " + jwtValue);
  } else {
    console.log("Không có giá trị jwt trong Local Storage.");
  }

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
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="icon"
        href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo-266x300@2x.png"
        sizes="64x64"
        type="image/png"
      />
      <title>Nhà nghỉ dưỡng và căn hộ cao cấp</title>
      <link rel="stylesheet" href="airbnb.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      <header>
        <div className={`overlay ${showFormHeader ? 'active' : ''}`} onClick={() => setShowFormHeader(false)}></div>
        <Link to={'/'}>
          <img
            className="img-header"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
            alt=""
          />
        </Link>

        <div className="search-box">
          <div className="button-group">
            <button className="anywhere" onClick={handleShowFormHeader}>
              Địa điểm bất kỳ &nbsp;&nbsp;<span className="separator">|</span>
            </button>
            <button className="anyweek">
              Tuần bất kỳ &nbsp;&nbsp;<span className="separator">|</span>
            </button>
            <button className="anyguest">&nbsp;&nbsp;Thêm khách</button>
          </div>
          <input className="search-input" type="text" />
          <button className="search-button">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          {
            showFormHeader && (
              <div className="form-header">
                <div style={{ height: '80px' }}>
                  <button className="choices">Chỗ ở</button>
                  <button className="choices">Trải nghiệm</button>
                  <button className="choices">Trải nghiệm trực tuyến</button>
                  <button className="close-form-header"
                    onClick={() => setShowFormHeader(false)}><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div className="body-choices">
                  <button onClick={handleSelectLocation}
                    className={`choices-details ${isSelectLocation ? 'active' : ' '}`}
                  >Địa điểm <br />
                    <input
                      className={`input-choice-details ${isSelectLocation ? 'active' : ''}`}
                      type="text"
                      placeholder="Tìm kiếm điểm đến"
                      value={inputValue}
                      onChange={handleInputChangee}
                    />
                  </button>
                  {
                    suggestions.length > 0 && (
                      <div className="suggest-location-list">
                        {suggestions.slice(0, 5).map((suggestion, index) => (
                          <div style={{ display: 'flex', alignItems: 'center' }} key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            <i className="fa-solid fa-location-dot icon-location-suggest-list"></i> {suggestion}
                          </div>
                        ))}

                      </div>
                    )
                  }
                  <button onClick={handleSelectChooseDay}
                    className="choices-details2"><span style={{ fontWeight: 'bolder' }}>Nhận phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button className="choices-details3"><span style={{ fontWeight: 'bolder' }}>Trả phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button onClick={handleSelectAddGuests}
                    className={`choices-details4 ${isSelectAddGuests ? 'active' : ''}`}><span style={{ fontWeight: 'bolder', position: 'absolute', left: '44px', top: '17px' }}>Khách</span> <br />
                    <span style={{ position: 'absolute', left: '24px', top: '32px' }}>Thêm khách</span>
                  </button>
                  <button onClick={handleSearchButtonClick}
                    className="choices-details5"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                </div>
                {
                  isSelectLocation && (
                    <div className="search-location">
                      <h1>Tìm kiếm theo khu vực</h1>
                      <div className="search-div">
                        <div className={`search-details ${selectedRegion === '' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('')}>
                          <img src="https://a0.muscache.com/pictures/f9ec8a23-ed44-420b-83e5-10ff1f071a13.jpg" alt="" />
                          <h3>Tìm kiếm linh hoạt</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Châu Âu' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Châu Âu')}>
                          <img src="https://a0.muscache.com/im/pictures/7b5cf816-6c16-49f8-99e5-cbc4adfd97e2.jpg?im_w=320" alt="" />
                          <h3>Châu Âu</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Thái Lan' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Thái Lan')}>
                          <img src="https://a0.muscache.com/im/pictures/924d2b73-6c65-4d04-a2ad-bbc028299658.jpg?im_w=320" alt="" />
                          <h3>Thái Lan</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Hoa kỳ' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Hoa kỳ')}>
                          <img src="https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320" alt="" />
                          <h3>Hoa kỳ</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Hàn Quốc' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Hàn Quốc')}>
                          <img src="https://a0.muscache.com/im/pictures/c193e77c-0b2b-4f76-8101-b869348d8fc4.jpg?im_w=320" alt="" />
                          <h3>Hàn Quốc</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Việt Nam' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Việt Nam')}
                        >
                          <img src="https://diaocthinhvuong.vn/wp-content/uploads/2019/10/vi-tri-dia-ly-cua-Viet-Nam.svg" alt="" />
                          <h3>Việt Nam</h3>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  isSelectAddGuests && (
                    <div className="addguests">
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Người lớn</h3>Từ 13 tuổi trở lên
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countOld === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseOld} disabled={countOld === 0}><span>-</span></button>
                          <span className="countOld">{countOld}</span>
                          <button className="crebtn" onClick={increaseOld}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Trẻ em</h3>Độ tuổi 2 - 12
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countYoung === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseYoung} disabled={countYoung === 0}><span>-</span></button>
                          <span className="countOld">{countYoung}</span>
                          <button className="crebtn" onClick={increaseYoung}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Em bé</h3>Dưới 2 tuổi
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countBaby === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseBaby} disabled={countBaby === 0}><span>-</span></button>
                          <span className="countOld">{countBaby}</span>
                          <button className="crebtn" onClick={increaseBaby}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Thú cưng</h3>
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countPets === 0 ? 'disable-degbtn' : ''}`} onClick={decreasePets} disabled={countPets === 0}><span>-</span></button>
                          <span className="countOld">{countPets}</span>
                          <button className="crebtn" onClick={increasePets}>+</button>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  isSelectChooseDay && <CalenderPicker />
                }


              </div>
            )
          }

        </div>
        <div className="header-2">
          {
            jwtValue && jwtValue ? (
              <Link to={"/host/bookedToday"}>
                <button className="header3">Đón tiếp khách</button>
              </Link>
            ) : (
              <Link to={"/host/bookedToday"}>
                <button className="header3">Cho thuê chỗ ở qua Airbnb</button>
              </Link>
            )
          }

          <span>
            <i className="fa-solid fa-globe world" />
          </span>

          {
            jwtValue && jwtValue ? userInfo && userInfo.avatar ? (
              <img
                onClick={handleOpenMenuDropdownLoginWithJWT}
                className="avatar-login"
                src={userInfo.avatar} alt="" />
            ) : (
              <img
                onClick={handleOpenMenuDropdownLoginWithJWT}
                className="avatar-login"
                src="https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg" alt="" />
            ) : (
              <span onClick={handleOpenMenuDropdownLogin}>
                <i className="fa-solid fa-circle-user" />
              </span>
            )
          }
          {
            isOpenDropMenuLoginWithJWT && (
              <div className="dropdown-menu-login">
                <div className="dropdown-menu-choice">Tin nhắn</div>
                <div className="dropdown-menu-choice">Chuyến đi</div>
                <div className="dropdown-menu-choice">Danh sách yêu thích</div>
                <hr />
                {
                  userInfo?.role ?
                    userInfo.role == "GUEST" ?
                      <>
                        <Link className="link-user-login"
                          to={'/host/firstCreateRoom'}>
                          <div className="dropdown-menu-choice">Bắt đầu cho thuê tại air-bnb</div>
                        </Link>
                      </>
                      :
                      <>
                        <Link className="link-user-login"
                          to={'/host/bookedToday'}>
                          <div className="dropdown-menu-choice">Quản lý nhà/phòng cho thuê</div>
                        </Link>
                      </>
                    : ""
                }
                <Link className="link-user-login"
                  to={'/account-settings'}>
                  <div className="dropdown-menu-choice">Tài khoản</div>
                </Link>
                <hr />
                <div className="dropdown-menu-choice">Trung tâm trợ giúp</div>
                <div
                  onClick={handleLogOut}
                  className="dropdown-menu-choice">Đăng xuất</div>
              </div>
            )
          }

          {
            isOpenDropMenuLogin && (
              <div className="dropdown-menu-login">
                <div onClick={toggleLoginForm}
                  className="dropdown-menu-choice">Đăng nhập</div>
                <div onClick={toggleLoginForm}
                  className="dropdown-menu-choice">Đăng ký</div>
                <hr />
                <div className="dropdown-menu-choice">Cho thuê chỗ ở qua Airbnb</div>
                <div className="dropdown-menu-choice">Trung tâm trợ giúp</div>
              </div>
            )
          }
        </div>
        {(


          <div className={`overlay2 ${isOverLayLoginForm ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverLayLoginForm ? 'active' : ''}`}>
              <div id="recaptcha-container" />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ marginRight: '25%' }}
                  onClick={toggleLoginForm} class="fa-solid fa-xmark close-description" ></i>
                <h2>Đăng nhập hoặc đăng ký</h2>
              </div>
              <hr />
              <div className='container-login-form'>
                <h1>Chào mừng bạn đến với Airbnb</h1>
                <p>Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.
                  <a style={{ color: 'black' }} href=""> Chính sách về quyền riêng tư</a></p>
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
                    }}
                  />
                </Box>
              </div>
              {
                loadingSingup ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div class="loadingio-spinner-ellipsis-bpnxs5xwm1u"><div class="ldio-8ew4rgpfv3q">
                      <div></div><div></div><div></div><div></div><div></div>
                    </div></div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center' }}
                    onClick={onSignup}>
                    <GradientButton style={{ width: '97%' }}>Tiếp tục</GradientButton>
                  </div>
                )
              }
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <hr style={{ width: '36%' }} />
                <div>Hoặc</div>
                <hr style={{ width: '36%' }} />
              </div>
              <div className="div-method-login-form">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "22px", width: "22px", marginRight: '30%' }}><path fill="#1877F2" d="M32 0v32H0V0z"></path><path fill="#FFF" d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"></path></svg>
                Tiếp tục với Facebook
              </div>
              <div className="div-method-login-form">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "22px", width: "22px", marginRight: '32%' }}><path fill="#4285f4" d="M24.12 25c2.82-2.63 4.07-7 3.32-11.19H16.25v4.63h6.37A5.26 5.26 0 0 1 20.25 22z"></path><path fill="#34a853" d="M5.62 21.31A12 12 0 0 0 24.12 25l-3.87-3a7.16 7.16 0 0 1-10.69-3.75z"></path><path fill="#fbbc02" d="M9.56 18.25c-.5-1.56-.5-3 0-4.56l-3.94-3.07a12.08 12.08 0 0 0 0 10.7z"></path><path fill="#ea4335" d="M9.56 13.69c1.38-4.32 7.25-6.82 11.19-3.13l3.44-3.37a11.8 11.8 0 0 0-18.57 3.43l3.94 3.07z"></path></svg>
                Tiếp tục với Google
              </div>
              <div className="div-method-login-form">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" focusable="false" style={{ display: "block", height: "22px", width: "22px", marginRight: '33%' }}><path d="m13.3 2.1a5.1 5.1 0 0 1 3.8-2.1 5.1 5.1 0 0 1 -1.2 3.8 4.1 4.1 0 0 1 -3.6 1.7 4.5 4.5 0 0 1 1-3.4zm-5 3.7c-2.8 0-5.8 2.5-5.8 7.3 0 4.9 3.5 10.9 6.3 10.9 1 0 2.5-1 4-1s2.6.9 4 .9c3.1 0 5.3-6.4 5.3-6.4a5.3 5.3 0 0 1 -3.2-4.9 5.2 5.2 0 0 1 2.6-4.5 5.4 5.4 0 0 0 -4.7-2.4c-2 0-3.5 1.1-4.3 1.1-.9 0-2.4-1-4.2-1z"></path></svg>
                Tiếp tục với Apple
              </div>
              <div className="div-method-login-form">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "22px", width: "22px", marginRight: '33%' }}><path d="M30.51 5.88A5.06 5.06 0 0 0 26 3H6a5.06 5.06 0 0 0-4.51 2.88A4.94 4.94 0 0 0 1 8v16a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V8a4.94 4.94 0 0 0-.49-2.12ZM6 5h20a2.97 2.97 0 0 1 1.77.6L17.95 14a2.98 2.98 0 0 1-3.9 0L4.23 5.6A2.97 2.97 0 0 1 6 5Zm23 19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a2.97 2.97 0 0 1 .1-.74l9.65 8.27a4.97 4.97 0 0 0 6.5 0l9.65-8.27A2.97 2.97 0 0 1 29 8Z"></path></svg>
                Tiếp tục với Email
              </div>
            </div>
          </div>

        )}
        {(
          <div className={`overlay2 ${isOverLayContinueWithPhone ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverLayContinueWithPhone ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ marginRight: '20%' }}
                  onClick={toggleContinueWithPhone} class="fa-solid fa-chevron-left close-description" ></i>
                <h2>Xác nhận số điện thoại của bạn</h2>
              </div>
              <hr />
              <div className='container-login-form'>
                <h3>Nhập mã mà chúng tôi gửi qua SMS tới số {selectedCountry ? `(+${selectedCountry.phone})` : ''} {phoneNumber}</h3>
              </div>
              <div className="div-confirm-otp-phone">
                <input className="input-confirm-otp-phone"

                  type="tel" placeholder="------" maxLength="6" value={valueOTP} onChange={(e) => setValueOTP(e?.target?.value)} />
              </div>
              <hr />
              <div className="continue-with-otp-phone">
                <h3 className="another-choice-continue-with-otp">Lựa chọn khác</h3>
                {
                  loadingSingup ? (
                    <div class="loadingio-spinner-ellipsis-bpnxs5xwm1u"><div class="ldio-8ew4rgpfv3q">
                      <div></div><div></div><div></div><div></div><div></div>
                    </div></div>
                  ) : (
                    <button
                      onClick={onOTPVerify}
                      className="btn-continue-with-otp-phone"

                    >Tiếp tục</button>
                  )
                }
              </div>
            </div>
          </div>
        )}
        {(
          <div className={`overlay2 ${isOverLayRegisterForm ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverLayRegisterForm ? 'active' : ''}`} style={{ width: "600px" }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ marginRight: '31%' }}
                  onClick={toggleRegisterForm} class="fa-solid fa-xmark close-description" ></i>
                <h3>Hoàn tất đăng ký</h3>
              </div>
              <hr />
              <div className='container-register-form'>
                <form onSubmit={handleSubmit(handleCreateUser)} id="form-register">
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
                      label="Tên"
                      placeholder="Tên"
                      required
                      error={errors?.firstName ? true : false}
                      variant="outlined"
                      {...register("firstName")}
                    />
                  </Box>
                  <Box
                    component="form"
                    noValidate
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { sm: '1fr 1fr' },
                      gap: 2,
                      marginTop: "6px"
                    }}
                  >
                    <ValidationTextField
                      label="Họ"
                      placeholder="Họ"
                      required
                      error={errors?.lastName ? true : false}
                      variant="outlined"
                      {...register("lastName")}
                    />
                  </Box>
                  {errors?.firstName?.message &&
                    <div className='error-message-register'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" className="icon-error-message">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                        </svg>
                      </span>
                      <div className="mesage-register-form error">{errors?.firstName?.message}</div>
                    </div>
                  }
                  {errors?.lastName?.message && !errors?.firstName?.message &&
                    <div className='error-message-register'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" className="icon-error-message">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                        </svg>
                      </span>
                      <div className="mesage-register-form error">{errors?.lastName?.message}</div>
                    </div>}
                  {errors?.lastName?.message || errors?.firstName?.message ? "" : (<div className="mesage-register-form">Đảm bảo rằng tên bạn nhập khớp với tên trên giấy tờ tùy thân do chính phủ cấp của bạn.</div>)}
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
                      label="Ngày sinh"
                      type="date"
                      required
                      error={errors?.dob ? true : false}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      {...register("dob")}
                    />
                  </Box>
                  {errors?.dob?.message ?
                    <div className='error-message-register'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" className="icon-error-message">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                        </svg>
                      </span>
                      <div className="mesage-register-form error">{errors?.dob?.message}</div>
                    </div>
                    :
                    <div className="mesage-register-form">Để đăng ký, bạn phải đủ 18 tuổi trở lên. Ngày sinh của bạn sẽ không được chia sẻ với người dùng Airbnb khác.</div>
                  }
                  <Box
                    component="form"
                    noValidate
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { sm: '1fr 1fr' },
                      gap: 2,
                      display: "block"
                    }}
                  >
                    <input
                      label="Email"
                      placeholder="Email"
                      required
                      variant="outlined"
                      {...register("email")}
                      className={`input-register-form ${errors?.email ? "error" : ""}`}
                    />
                  </Box>
                  {errors?.email?.message ?
                    <div className='error-message-register'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false"
                          className="icon-error-message">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                        </svg>
                      </span>
                      <div className="mesage-register-form error">{errors?.email?.message}</div>
                    </div>
                    :
                    <div className="mesage-register-form">Chúng tôi sẽ gửi phiếu thu và xác nhận chuyến đi qua email cho bạn.</div>
                  }
                  <div className="registration-terms">Bằng việc chọn <span style={{ fontWeight: "bold" }}>Đồng ý và tiếp tục,</span> tôi đồng ý với <Link>Điều khoản dịch vụ</Link>, <Link>Điều khoảng dịch vụ thanh toán </Link>và <Link>Chính sách không phân biệt </Link>của Airbnb, đồng thời chấp nhận <Link>Chính sách về quyền riêng tư</Link></div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GradientButton>Tiếp tục</GradientButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {(
          <div className={`overlay2 ${isOverFormFinishRegister ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverFormFinishRegister ? 'active' : ''}`} style={{ width: "650px" }}>
              <div style={{ margin: "32px 16px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "42px", width: "42px", fill: "rgb(255, 90, 95)", marginBottom: "10%" }}>
                  <path d="M16 1c2 0 3.46.96 4.75 3.27l.53 1.02a424.58 424.58 0 0 1 7.1 14.84l.15.35c.67 1.6.9 2.48.96 3.4v.41l.01.23c0 4.06-2.88 6.48-6.36 6.48-2.22 0-4.55-1.26-6.7-3.39l-.26-.26-.17-.17h-.02l-.17.18c-2.05 2.1-4.27 3.42-6.42 3.62l-.28.01-.26.01c-3.48 0-6.36-2.42-6.36-6.48v-.47c.03-.93.23-1.77.83-3.24l.22-.53c.97-2.3 6.08-12.98 7.7-16.03C12.55 1.96 14 1 16 1zm0 2c-1.24 0-2.05.54-2.99 2.21l-.52 1a422.57 422.57 0 0 0-7.03 14.7l-.35.84a6.86 6.86 0 0 0-.6 2.24l-.01.33v.2C4.5 27.4 6.41 29 8.86 29c1.77 0 3.87-1.24 5.83-3.35-2.3-2.94-3.86-6.45-3.86-8.91 0-2.92 1.94-5.39 5.18-5.42 3.22.03 5.16 2.5 5.16 5.42 0 2.45-1.56 5.96-3.86 8.9 1.97 2.13 4.06 3.36 5.83 3.36 2.45 0 4.36-1.6 4.36-4.48v-.4a7.07 7.07 0 0 0-.72-2.63l-.25-.6C25.47 18.41 20.54 8.12 19 5.23 18.05 3.53 17.24 3 16 3zm.01 10.32c-2.01.02-3.18 1.51-3.18 3.42 0 1.8 1.18 4.58 2.96 7.04l.2.29.18-.24c1.73-2.38 2.9-5.06 3-6.87v-.22c0-1.9-1.17-3.4-3.16-3.42z"></path>
                </svg>
                <h4>Cam kết cộng đồng chúng tôi</h4>
                <h1>Airbnb là nơi mà tất cả mọi người đều có thể cảm thấy là một cộng đồng dành cho họ.</h1>
                <div style={{ margin: "24px 0px", color: "gray" }}>Để đảm bảo điều này, chúng tôi đề nghị bạn cam kết như sau:</div>
                <div style={{ margin: "24px 0px", color: "gray" }}>Tôi đồng ý sẽ đối xử với tất cả mọi người trong cộng đồng Airbnb một cách tôn trọng và không phán xét hay thành kiến, bất kể chủng tộc, tôn giáo, nguồn gốc quốc gia, dân tộc, màu da, tình trạng khuyết tật, giới tính, bản dạng giới, khuynh hướng tình dục hoặc tuổi tác.</div>
                <div>Tìm hiểu thêm <i class="fa-solid fa-chevron-right"></i></div>
                <div style={{ display: "flex", justifyContent: 'center', flexDirection: "column", width: "111.5%", marginLeft: "-2%", marginTop: "32px" }}>
                  <GradientButton onClick={handleAcceptRegistrationTermsAndCreateUser}>Đồng ý và tiếp tục</GradientButton>
                  <button className="button-form" onClick={toggleFormFinishRegister}>Từ chối</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {(
          <div className={`overlay2 ${isOverLayVerifyEmail ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverLayVerifyEmail ? 'active' : ''}`} style={{ width: "600px" }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ marginRight: '25%' }}
                  onClick={toggleVerifyEmailForm} class="fa-solid fa-xmark close-description" ></i>
                <h2>Xác nhận tài khoản</h2>
              </div>
              <hr />
              <div className='container-register-form'>
                <h2>Giúp chúng tôi xác minh danh tính của bạn</h2>
                <div>Để tiếp tục, bạn cần xác nhận tài khoản của mình thông qua một trong các tùy chọn sau.</div>
                <button className="button-verify-email" onClick={handleVerifyEmail}>
                  <i class="fa-regular fa-envelope icon-veriry-email" ></i>
                  <h3>Email</h3>
                  <i class="fa-solid fa-chevron-right icon-veriry-email"></i>
                </button>
              </div>
              <hr />
            </div>

          </div>
        )}
        {(
          <div className={`overlay2 ${isOverFormSuccess ? '' : 'd-none'}`} >
            <div className={`appearing-div ${isOverFormSuccess ? 'active' : ''}`} style={{ width: "600px" }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ marginRight: '26%' }}
                  onClick={toggleFormSuccess} class="fa-solid fa-xmark close-description" ></i>
                <h2>Đăng ký tài khoản</h2>
              </div>
              <hr />
              <div className='container-register-form'>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: "75px", width: "75px", fill: "rgb(255, 90, 95)", marginBottom: "5%" }}>
                    <path d="M16 1c2 0 3.46.96 4.75 3.27l.53 1.02a424.58 424.58 0 0 1 7.1 14.84l.15.35c.67 1.6.9 2.48.96 3.4v.41l.01.23c0 4.06-2.88 6.48-6.36 6.48-2.22 0-4.55-1.26-6.7-3.39l-.26-.26-.17-.17h-.02l-.17.18c-2.05 2.1-4.27 3.42-6.42 3.62l-.28.01-.26.01c-3.48 0-6.36-2.42-6.36-6.48v-.47c.03-.93.23-1.77.83-3.24l.22-.53c.97-2.3 6.08-12.98 7.7-16.03C12.55 1.96 14 1 16 1zm0 2c-1.24 0-2.05.54-2.99 2.21l-.52 1a422.57 422.57 0 0 0-7.03 14.7l-.35.84a6.86 6.86 0 0 0-.6 2.24l-.01.33v.2C4.5 27.4 6.41 29 8.86 29c1.77 0 3.87-1.24 5.83-3.35-2.3-2.94-3.86-6.45-3.86-8.91 0-2.92 1.94-5.39 5.18-5.42 3.22.03 5.16 2.5 5.16 5.42 0 2.45-1.56 5.96-3.86 8.9 1.97 2.13 4.06 3.36 5.83 3.36 2.45 0 4.36-1.6 4.36-4.48v-.4a7.07 7.07 0 0 0-.72-2.63l-.25-.6C25.47 18.41 20.54 8.12 19 5.23 18.05 3.53 17.24 3 16 3zm.01 10.32c-2.01.02-3.18 1.51-3.18 3.42 0 1.8 1.18 4.58 2.96 7.04l.2.29.18-.24c1.73-2.38 2.9-5.06 3-6.87v-.22c0-1.9-1.17-3.4-3.16-3.42z"></path>
                  </svg>
                  <h2>Chào mừng bạn đến với Airbnb</h2>
                  <div>Khám phá các nơi ở và trải nghiệm độc đáo trên khắp thế giới</div>
                </div>

                <button className="button-next-modal" onClick={toggleFormSuccess}>
                  Tiếp tục
                </button>
              </div>
              <hr />
            </div>

          </div>
        )}
      </header>
    </>
  )
}

export default Header;