import React from 'react';
import Container from './Container';
import * as _ from 'lodash';
import type { PanelAttributes } from 'react-panorama-x';

const Fill = React.forwardRef<Panel, PanelAttributes & { weight?: number }>((props, ref) => {
    return (
        <Container
            {..._.omit(props, 'weight')}
            ref={ref}
            style={{
                width: `fill-parent-flow(${props.weight ?? 1})`,
                height: `fill-parent-flow(${props.weight ?? 1})`,
                ...props.style,
            }}
        >
            {props.children}
        </Container>
    );
});

export default Fill;
