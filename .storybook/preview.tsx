import React from "react";

import { Preview } from "@storybook/react";
import { CustomTheme, ToastContainer } from "@lipihipi/rtc-ui-components";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <CustomTheme>
        <ToastContainer />
        <Story />
      </CustomTheme>
    ),
  ],
};

export default preview;