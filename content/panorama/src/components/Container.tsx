import React, { useEffect, useMemo, useRef } from 'react';
import * as _ from 'lodash';
import type { PanelAttributes } from 'react-panorama-x';

// import { AnimatedProps } from '../animated/Animated';

export type ContainerProps = {
    full?: boolean | 'width' | 'height';
    fill?: boolean | 'width' | 'height';
    align?: ['left' | 'right' | 'center', 'top' | 'bottom' | 'center'];
    overflow?: 'squish' | 'clip' | 'scroll' | 'noclip';
} & PanelAttributes;
// &     AnimatedProps;

const Container = React.forwardRef<Panel, ContainerProps>((props, ref) => {
    const style = useMemo(() => {
        const style: PanelAttributes['style'] = {};
        if (props.fill === 'width' || props.fill === true) {
            style.width = 'fill-parent-flow(1)';
        }
        if (props.fill === 'height' || props.fill === true) {
            style.height = 'fill-parent-flow(1)';
        }

        if (props.full === 'width' || props.full === true) {
            style.width = '100%';
        }

        if (props.full === 'height' || props.full === true) {
            style.height = '100%';
        }

        if (props.align) {
            style.align = props.align.join(' ');
        }

        if (props.overflow) {
            style.overflow = props.overflow as any;
        }

        return style;
    }, [props.fill]);

    const innerRef = useRef<Panel>(null);

    // useEffect(() => {
    //     props.animate?.bind(innerRef);
    // }, [props.animate]);

    return (
        <Panel
            {..._.omit(props, 'fill', 'align', 'full', 'overflow', 'animated')}
            ref={element => {
                if (ref != null) {
                    if (typeof ref === 'function') {
                        ref(element);
                    } else {
                        ref.current = element;
                    }
                }
                Reflect.set(innerRef, 'current', element);
            }}
            style={{
                ...style,
                ...props.style,
            }}
        >
            {props.children}
        </Panel>
    );
});

export default Container;
