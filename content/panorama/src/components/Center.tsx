import React from 'react';
import Container from './Container';

const Center: React.FC = props => {
    return <Container align={['center', 'center']}>{props.children}</Container>;
};

export default Center;
