const initialData = {
    certificateStatusFilterLabel: 'pending'
}

export default filtersReducer = (prevState = initialData, action) => {
    switch (action.type) {
    case 'SET_CERTIFICATE_STATUS_FILTER_LABEL':
        return {
          certificateStatusFilterLabel: action.certificateStatusFilterLabel,
        };
    default:
        return prevState;
    }
}
