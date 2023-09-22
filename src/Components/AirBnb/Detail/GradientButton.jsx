import React from 'react';

class GradientButton extends React.Component {
    
    handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gradientColor = `linear-gradient(45deg, 
            rgba(${x / rect.width * 255}, ${y / rect.height * 255}, 100), 
            rgba(${y / rect.height * 255}, ${x / rect.width * 255}, 100))`;

        e.target.style.background = gradientColor;
    }

    handleMouseOut = (e) => {
        e.target.style.background = 'linear-gradient(45deg, #FF385C, #F0255F, #FB355B)';
    }

    render() {
        return (
            <button
                className="btn-book-now"
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}

export default GradientButton;