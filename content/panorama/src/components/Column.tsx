import React, { useMemo } from 'react';
import type { ContainerProps } from './Container';
import Container from './Container';
import * as _ from 'lodash';
export type ColumnProps = { wrap?: boolean; justify?: boolean };

const Column = React.forwardRef<Panel, ColumnProps & ContainerProps>((props, ref) => {
    const children = useMemo(() => {
        return React.Children.map(props.children, child => {
            if (child) {
                if (props.justify) {
                    return <Container style={{ height: 'fill-parent-flow(1)' }}>{child}</Container>;
                } else {
                    return child;
                }
            }
            return null;
        });
    }, [props.children]);

    return (
        <Container {..._.omit(props, 'wrap', 'justify')} ref={ref} style={{ ...props.style, flowChildren: props.wrap ? 'down-wrap' : 'down' }}>
            {children}
        </Container>
    );
});

export default Column;
