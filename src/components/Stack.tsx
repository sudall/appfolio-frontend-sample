/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Children, cloneElement, FC, isValidElement, ReactNode } from 'react';

import { Box, BoxProps, Flex, StackProps } from '@chakra-ui/core/dist';

const Stack: FC<StackProps> = ({
    direction,
    isInline = false,
    children,
    align,
    justify,
    spacing = 2,
    shouldWrapChildren,
    ...rest
}) => {
    let flexDirection: BoxProps['flexDirection'];

    if (isInline != null) {
        flexDirection = isInline ? 'row' : 'column';
    }

    if (direction != null) {
        flexDirection = direction;
    }

    const validChildren: ReactNode[] = [];
    Children.forEach(children, child => {
        if (isValidElement(child)) {
            validChildren.push(child);
        }
    });

    return (
        <Flex
            align={align}
            justify={justify}
            direction={flexDirection}
            {...rest}
        >
            {Children.map(children, (child, index) => {
                if (!isValidElement(child)) return;
                let isLastChild =
                    validChildren[validChildren.length - 1] === child;
                // @ts-ignore
                const isHorizontalDirection = direction === 'horizontal';
                let spacingProps = {};
                if (!isLastChild) {
                    spacingProps =
                        isInline || isHorizontalDirection
                            ? { mr: spacing }
                            : { mb: spacing };
                }

                if (shouldWrapChildren) {
                    return (
                        <Box d='inline-block' {...spacingProps}>
                            {child}
                        </Box>
                    );
                }
                return cloneElement(child, spacingProps);
            })}
        </Flex>
    );
};

export default Stack;
