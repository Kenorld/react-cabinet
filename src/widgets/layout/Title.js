import React from 'react';
import PropTypes from 'prop-types'
import { collectProps } from '../utils'

const Title = ({ defaultTitle, record, title }) => {
    if (!title) {
        return <span>{defaultTitle}</span>;
    }
    if (typeof title === 'string') {
        return <span>{title}</span>;
    }
    return React.cloneElement(title, collectProps({ record }, title.type.propTypes));
};

Title.propTypes = {
    defaultTitle: PropTypes.string.isRequired,
    record: PropTypes.object,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

export default Title;
