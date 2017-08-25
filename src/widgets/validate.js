import React from 'react';
import { getValues } from './utils'

export function validateInput(target, key, descriptor) {
    const method = descriptor.initializer;
    descriptor.initializer = function () {
        return function (event) {
            if(this.props.validators){
                this.props.validators.map((validator, index) => {
                    check.apply(this, [validator, this.props.errorMessages[index], event.target.value]);
                });
            }
            
            this._value = event.target.value;
            method.apply(this)(event);
        }
    };
    return descriptor;
}
export function validateForm(Form) {

    return class extends React.Component {
        onSubmit(data) {
            if (this.wci) {
                let all_clear = true;
                this.wci.map((child) => {
                    if (child.props.validators) {
                        for (var i = 0, l = child.props.validators.length; i < l; i++) {
                            if (!check.apply(child, [child.props.validators[i], child.props.errorMessages[i], getValues(child.props.record, child.props.source)[0]])) {
                                all_clear = false;
                                break;
                            }
                        }
                    }
                });
                if (all_clear) {
                    console.log('all clear');
                    this.props.onSubmit(data);
                }
            }
        }
        proc(wrappedComponentInstance) {
            if(wrappedComponentInstance){
                this.wci = wrappedComponentInstance.inputs;
            }
        }
        render() {
            const props = Object.assign({}, this.props, { ref: this.proc.bind(this) })
            return <Form {...props} onSubmit={this.onSubmit.bind(this)} />
        }
    }
}

function check(validator, errorMsg, data) {
    if (!getValidator(validator)(data)) {
        this._errorText = errorMsg;
        this.props.writeValue(this, 'Error');
        return false;
    } else {
        this._errorText = '';
        return true;
    }
}

function getValidator(validator) {
    switch (validator) {
        case 'required':
            return validations.required
            break;
        case 'email':
            return validations.isEmail
            break;
        case 'phone':
            return validations.isNumber
            break;
        default:
            return function () { return true };
    }
}

// ValidationRules
// copy from <react-material-ui-form-validator | https://github.com/NewOldMax/react-material-ui-form-validator>
// -----------------------------------------------------------------------------------------------------------------
var isExisty = function isExisty(value) {
    return value !== null && value !== undefined;
};

var _isEmpty = function _isEmpty(value) {
    return value === '' || value === undefined || value == null;
};

var isEmptyTrimed = function isEmptyTrimed(value) {
    if (typeof value === 'string') {
        return value.trim() === '';
    }
    return true;
};

var validations = {
    matchRegexp: function matchRegexp(value, regexp) {
        var validationRegexp = regexp instanceof RegExp ? regexp : new RegExp(regexp);
        return !isExisty(value) || _isEmpty(value) || validationRegexp.test(value);
    },

    // eslint-disable-next-line
    isEmail: function isEmail(value) {
        return validations.matchRegexp(value, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
    },

    isEmpty: function isEmpty(value) {
        return _isEmpty(value);
    },

    required: function required(value) {
        return !_isEmpty(value);
    },

    trim: function trim(value) {
        return !isEmptyTrimed(value);
    },

    isNumber: function isNumber(value) {
        return validations.matchRegexp(value, /^-?[0-9]\d*(\d+)?$/i);
    },

    isFloat: function isFloat(value) {
        return validations.matchRegexp(value, /^(?:[1-9]\d*|0)?(?:\.\d+)?$/i);
    },

    isPositive: function isPositive(value) {
        if (isExisty(value)) {
            return (validations.isNumber(value) || validations.isFloat(value)) && value >= 0;
        }
        return true;
    },

    maxNumber: function maxNumber(value, max) {
        return !isExisty(value) || _isEmpty(value) || parseInt(value, 10) <= parseInt(max, 10);
    },

    minNumber: function minNumber(value, min) {
        return !isExisty(value) || _isEmpty(value) || parseInt(value, 10) >= parseInt(min, 10);
    }
};
// -----------------------------------------------------------------------------------------------------------------