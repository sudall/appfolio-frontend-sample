import React, { ComponentType, FC } from 'react';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';

class TestUtils {
    static createShallowSetup<TProps>(
        Component: FC<TProps>,
        defaultPropsFactory: () => TProps
    ) {
        return (props?: Partial<TProps>) => {
            return shallow(<Component {...defaultPropsFactory()} {...props} />);
        };
    }

    static findByDataname<TProps>(
        wrapper: ShallowWrapper | ReactWrapper,
        componentType: ComponentType<TProps>,
        dataname: string
    ) {
        if (wrapper instanceof ShallowWrapper) {
            return wrapper
                .find(`[data-name="${dataname}"]`)
                .find<TProps>(componentType);
        }

        return wrapper
            .find(`[data-name="${dataname}"]`)
            .find<TProps>(componentType);
    }

    static createFindByDataname<TProps>(
        componentType: ComponentType<TProps>,
        dataname: string
    ) {
        return (wrapper: ShallowWrapper | ReactWrapper) => {
            return TestUtils.findByDataname<TProps>(
                wrapper,
                componentType,
                dataname
            );
        };
    }
}

export default TestUtils;
