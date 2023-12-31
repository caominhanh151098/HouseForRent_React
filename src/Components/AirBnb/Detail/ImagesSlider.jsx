import React, { useEffect, useState } from 'react';
import AutoPlaySwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import "../Slider.css"
import UseFetchHouse from '../../../Hooks/UseFetchHouse';
import { Link } from 'react-router-dom';

const VirtualizeSwipeableViews = virtualize(AutoPlaySwipeableViews);

function ImagesSlider({ house, currentImageIndex  }) {
    const { houseList, loading } = UseFetchHouse();
    const theme = useTheme();
    const maxSteps = house ? house?.images.length ? house?.images.length > 7 ?  house?.images.length : house?.images.length : house?.images.length : house?.images.length;
    const [activeStep, setActiveStep] = useState(currentImageIndex || 0);
    const [buttonOpacity, setButtonOpacity] = useState(0);

    useEffect(() => {
        setActiveStep(currentImageIndex || 0);
    }, [currentImageIndex]);

    const huy = activeStep;
    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
        
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };

    // useEffect(() => {
    //     document.querySelector('.MuiPaper-root button').style.display='none'
    // } ,[])

    const handleMouseLeave = () => {
        if (buttonOpacity === 1) {
            setButtonOpacity(0);
        }
    };

    return (
        <Box sx={{ width: 1235, height: 720 }}>
             <div style={{fontWeight:'22px'}}>{activeStep + 1} / {maxSteps}</div>
            <VirtualizeSwipeableViews
                index={activeStep}
                onChangeIndex={setActiveStep}
                enableMouseEvents
                slideRenderer={({ index }) => (
                    <div key={index} className="custom-image-container">
                         <Link to={`/house/${house.id}`}>
                        <img className='img'
                         onMouseEnter={() => setButtonOpacity(1)} 
                         onMouseLeave={() => setButtonOpacity(0)} 
                            src={house.images[huy].srcImg}
                            alt={`Image ${index + 1}`}
                            title={house.images[huy].description}
                            style={{
                                width: '1200px',
                                height: '680px',
                                objectFit: 'cover',
                            }}
                        />
                        </Link>
                        {/* <div>{house.images[huy].description}</div> */}
                    </div>
                )}
            />
            <div className="centered-content" >{house.images[huy].description}</div>
            <MobileStepper
             style={{opacity: buttonOpacity}}
             onMouseOut={() => setButtonOpacity(1)}
             onMouseLeave={handleMouseLeave} 
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        className="stepper-button2"
                        size="small"
                        onClick={handleNext}
                        // disabled={activeStep === maxSteps - 1}
                        style={{opacity: buttonOpacity, marginTop: '-54%'}}
                        onMouseOut={() => setButtonOpacity(1)}
                        onMouseLeave={handleMouseLeave} 
                    >

                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button className="stepper-button2"
                    onMouseOut={() => setButtonOpacity(1)}
                    onMouseLeave={handleMouseLeave} 
                    style={{opacity: buttonOpacity}}
                        size="small" onClick={handleBack} 
                        // disabled={activeStep === 0}>
                        >
                            
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}

                    </Button>
                }
            />
        </Box>
    );
}

export default ImagesSlider;