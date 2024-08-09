export const FUSES = {
    CAN_DO_EVERYTHING: 0,
    CANNOT_UNWRAP: 1,
    CANNOT_BURN_FUSES: 2,
    CANNOT_TRANSFER: 4,
    CANNOT_SET_RESOLVER: 8,
    CANNOT_SET_TTL: 16,
    CANNOT_CREATE_SUBDOMAIN: 32,
    CANNOT_APPROVE: 64,
    PARENT_CANNOT_CONTROL: 2 ** 16,
    IS_DOT_ETH: 2 ** 17,
    CAN_EXTEND_EXPIRY: 2 ** 18,
};
export const DAY = 24n * 60n * 60n;
