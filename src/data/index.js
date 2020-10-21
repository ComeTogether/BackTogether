export const Role = {
  admin: {
    name: ["admin"],
    inherits: ["user", "health", "verifier"],
  },
  user: {
    name: ["user"],
    inherits: [],
  },
  health: {
    name: ["health"],
    inherits: ["user"],
  },
  verifier: {
    name: ["verifier"],
    inherits: ["user"],
  },
};

export const Types = [
  {
    label: "RT-PCR",
    value: "RT-PCR",
    checkBoxes: [
      {
        label: "RT-PCR",
        value: 0,
      },
    ],
  },
  {
    label: "Rapid RT-PCR",
    value: "type2",
    checkBoxes: [
      {
        label: "Rapid RT-PCR",
        value: 0,
      },
    ],
  },
  {
    label: "Antibodies Test",
    value: "type3",
    checkBoxes: [
      {
        label: "Antibodies",
        value: 0,
      },
    ],
  },
  {
    label: "Rapid Antibodies Test",
    value: "type4",
    checkBoxes: [
      {
        label: "Rapid Antibodies",
        value: 0,
      },
    ],
  },
];

export const DropdownRoles = [
  {
    label: "User",
    value: 0,
  },
  {
    label: "Health",
    value: 1,
  },
];

export const DropdownCertificateStatusFilterOptions = ['All', 'Pending', 'Accepted', 'Rejected'];

