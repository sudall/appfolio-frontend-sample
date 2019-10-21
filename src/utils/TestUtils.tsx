import React, { ComponentType, FC } from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import SystemUtils from 'utils/SystemUtils';
import { theme, ThemeProvider } from '@chakra-ui/core/dist';

class TestUtils {
    static createShallowSetup<TProps>(
        Component: FC<TProps>,
        defaultPropsFactory: () => TProps
    ) {
        return (props?: Partial<TProps>) => {
            return shallow(<Component {...defaultPropsFactory()} {...props} />);
        };
    }

    static createMountSetup<TProps>(
        Component: FC<TProps>,
        defaultPropsFactory: () => TProps
    ) {
        return (props?: Partial<TProps>) => {
            return mount(
                <ThemeProvider theme={theme}>
                    <Component {...defaultPropsFactory()} {...props} />
                </ThemeProvider>
            );
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

    static async waitForAsync(wrapper: ReactWrapper) {
        // queue up a task which should only run after all microtasks (promises) are complete.
        // see https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
        await SystemUtils.setTimeout(0);
        wrapper.update();
    }
}

export default TestUtils;
