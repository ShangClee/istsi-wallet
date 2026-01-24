import type { Meta, StoryObj } from "@storybook/react";
import AccountSelectionList from "../components/AccountSelectionList";
import { Account } from "~App/contexts/accounts";

const meta: Meta<typeof AccountSelectionList> = {
  title: "Account/AccountSelectionList",
  component: AccountSelectionList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccountSelectionList>;

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Main Account",
    // Valid public key
    publicKey: "GDHCCX4YQXQXCMA6LCNSLGAKNKFSOFY6NAL6GU7TTYVCHOG2EYFGGYT4",
    accountID: "GDHCCX4YQXQXCMA6LCNSLGAKNKFSOFY6NAL6GU7TTYVCHOG2EYFGGYT4",
    testnet: true,
  } as Account,
  {
    id: "2",
    name: "Savings",
    // Valid public key
    publicKey: "GDGQJMPZATOYZIW3TWOHGGDED5PYGOYR4EONBEIN6MDV5YUQIZIQHSSM",
    accountID: "GDGQJMPZATOYZIW3TWOHGGDED5PYGOYR4EONBEIN6MDV5YUQIZIQHSSM",
    testnet: true,
  } as Account,
];

export const Default: Story = {
  args: {
    accounts: mockAccounts,
    testnet: true,
  },
};

export const Empty: Story = {
  args: {
    accounts: [],
    testnet: true,
  },
};

export const Disabled: Story = {
  args: {
    accounts: mockAccounts,
    testnet: true,
    disabled: true,
  },
};
