import React, { useMemo } from 'react';
import type { ContainerProps } from './Container';
import Container from './Container';
import * as _ from 'lodash';

const Row = React.forwardRef<Panel, { wrap?: boolean; justify?: boolean } & ContainerProps>((props, ref) => {
    const children = useMemo(() => {
        return React.Children.map(props.children, child => {
            if (child) {
                if (props.justify) {
                    return <Container style={{ width: 'fill-parent-flow(1)' }}>{child}</Container>;
                } else {
                    return child;
                }
            }
            return null;
        });
    }, [props.children]);

    return (
        <Container {..._.omit(props, 'wrap', 'justify')} ref={ref} style={{ ...props.style, flowChildren: props.wrap ? 'right-wrap' : 'right' }}>
            {children}
        </Container>
    );
});

export default Row;
