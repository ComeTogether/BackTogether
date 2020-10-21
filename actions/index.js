//authReducer
export const insertToken = (token) => ({ type: 'SIGN_IN', token: token});

export const deleteToken = () => ({  type: 'SIGN_OUT' });

export const restoreToken = () => ({ type: 'RESTORE_TOKEN' });


//passCodeReducer
export const setPassCode = (pass) => ({type: 'SET_PASSCODE', passCode:pass});

export const setNewCode = (pass) => ({type: 'SET_NEWCODE', newCode:pass});

export const setConfCode = (pass) => ({type: 'SET_CONFCODE', confCode:pass});

export const resetConfCode = () => ({type:'RESET_CONFCODE'});

export const resetPassCode = () => ({type:'RESET_PASSCODE'});

export const resetNewCode = () => ({type:'RESET_NEWCODE'});

export const setStatus = (status) => ({type:'SET_STATUS', status:status});

export const setRepeat = (status) => ({type:'SET_REPEAT', status:status})

//stepsReducer
export const setStepsSeen = (flag) => ({type:'SET_STEPS', stepsSeen:flag});

//filter actions
export const setCertificateStatusFilterLabel = (certificateStatusFilterLabel) => (
  {
    type: 'SET_CERTIFICATE_STATUS_FILTER_LABEL',
    certificateStatusFilterLabel: certificateStatusFilterLabel
  });
