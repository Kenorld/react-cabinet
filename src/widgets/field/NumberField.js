import React from 'react';
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import get from 'lodash.get';

const hasNumberFormat = !!(typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function');

/**
 * Display a numeric value as a locale string.
 *
 * Uses Intl.NumberFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs number as is (and ignores the locales and options props).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * @example
 * <NumberField source="score" />
 * // renders the record { id: 1234, score: 567 } as
 * <span>567</span>
 *
 * <NumberField source="score" elStyle={{ color: 'red' }} />
 * // renders the record { id: 1234, score: 567 } as
 * <span style="color:red;">567</span>
 *
 * <NumberField source="share" options={{ style: 'percent' }} />
 * // renders the record { id: 1234, share: 0.2545 } as
 * <span>25%</span>
 *
 * <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>$25.99</span>
 *
 * <NumberField source="price" locales="fr-FR" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>25,99 $US</span>
 */
@observer
class NumberField extends React.Component {
    render() {
        const { record, source, locales, options, elStyle } = this.props
        if (!record) return null;
        const value = this.props.convert(get(record, source))
        if (value == null) return null;
        if (!hasNumberFormat) return <span style={elStyle}>{value}</span>;
        return <span style={elStyle}>{value.toLocaleString(locales, options)}</span>
    }
}

NumberField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    convert: PropTypes.oneOfType([PropTypes.func,PropTypes.object]),
};

NumberField.defaultProps = {
    addLabel: true,
    style: { textAlign: 'right' },
    headerStyle: { textAlign: 'right' },
    convert: function (value) {
        return value
    },
};

export default NumberField;
