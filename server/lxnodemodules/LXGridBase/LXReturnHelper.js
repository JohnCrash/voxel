// LXCommunicator
(function(module, require, exports) {
        const Ice = require('ice').Ice;
        const LXGrid = Ice.__M.require(module, [
            'LXGrid.System/LXSliceBase'
        ]).LXGrid;

        class LXReturnHelper {

            MakeLXReturnSysError(sysErr, msgCustom = '') {
                if (msgCustom == '') {
                    switch (sysErr) {
                        case LXGrid.Common.LXEnumErrorSys.LXErrorInvalidRangeVisit.value:
                            msgCustom = 'succeed';
                            break;
                        case LXGrid.Common.LXEnumErrorSys.LXErrorInvalidProxyType.value:
                            msgCustom = 'no data';
                            break;
                        case LXGrid.Common.LXEnumErrorSys.LXErrorObjectNotExist.value:
                            msgCustom = 'invalid parameter';
                            break;
                        case LXGrid.Common.LXEnumErrorSys.LXErrorInvalidConstKey.value:
                            msgCustom = 'internal error';
                            break;
                        default:
                            msgCustom = '';
                            break;
                    }
                }

                return new LXGrid.Common.LXReturn(sysErr, msgCustom);
            }

            MakeLXReturnBaseError(baseErr, msgCustom = '') {
                if (msgCustom == '') {
                    //  common err
                    //  system err
                    switch (baseErr) {
                        case LXGrid.Common.LXEnumErrorBase.LXErrorSucceed.value:
                            msgCustom = 'succeed';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorNoData.value:
                            msgCustom = 'no data';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorInvalidParameter.value:
                            msgCustom = 'invalid parameter';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorInternal.value:
                            msgCustom = 'internal error';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorNotSupport.value:
                            msgCustom = 'not support';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorNoPower.value:
                            msgCustom = 'no power';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorStringToLong.value:
                            msgCustom = 'string too long';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorPrivacyNotAllow.value:
                            msgCustom = 'privacy not allow';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorReachCountLimit.value:
                            msgCustom = 'reach count limit';
                            break;
                        case LXGrid.Common.LXEnumErrorBase.LXErrorAlreadyExist.value:
                            msgCustom = 'already exist';
                            break;
                        default:
                            msgCustom = '';
                            break;
                    }
                }

                return new LXGrid.Common.LXReturn(baseErr, msgCustom);
            }

            MakeLXError(errCode, msgCustom = '') {
                return new LXGrid.Common.LXReturn(errCode, msgCustom);
            }

            //  errors in section base
            LXSucceed() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorSucceed.value);
            }
            LXInvalidParameter(msg = '') {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorInvalidParameter.value, msg);
            }
            LXInternal() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorInternal.value);
            }
            LXNotSupport() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorNotSupport.value);
            }
            LXNoPower() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorNoPower.value);
            }
            LXTooLong() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorStringToLong.value);
            }
            LXNotAllow() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorPrivacyNotAllow.value);
            }
            LXReachLimit() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorReachCountLimit.value);
            }
            LXAlreadyExist() {
                return this.MakeLXReturnBaseError(LXGrid.Common.LXEnumErrorBase.LXErrorAlreadyExist.value);
            }

            //  errors in section system
            LXObjectNotExist() {
                return this.MakeLXReturnSysError(LXGrid.Common.LXEnumErrorSys.LXErrorObjectNotExist.value);
            }
            LXInvalidConstKey() {
                return this.MakeLXReturnSysError(LXGrid.Common.LXEnumErrorSys.LXErrorInvalidConstKey.value);
            }
            LXInvalidRangeVisit() {
                return this.MakeLXReturnSysError(LXGrid.Common.LXEnumErrorSys.LXErrorInvalidRangeVisit.value);
            }
            LXInvalidProxyType() {
                return this.MakeLXReturnSysError(LXGrid.Common.LXEnumErrorSys.LXErrorInvalidProxyType.value);
            }

            // error in invoker
            LXInvokerError(m) {
                return this.MakeLXError(100, m);
            }

            IsLXSucceed(lxRet) {
                return (lxRet != undefined) && (lxRet != null) && ((lxRet.error === LXGrid.Common.LXEnumErrorBase.LXErrorSucceed.value) ? true : false);
            }
        };

        LXGrid.LXReturnHelper = new LXReturnHelper();
        exports.LXGrid = LXGrid;
    }
    (typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? module : undefined,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? require : window.Ice.__require,
        typeof(global) !== 'undefined' && typeof(global.process) !== 'undefined' ? exports : window));