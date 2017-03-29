import React, { Component, PropTypes } from 'react';
import inflection from 'inflection';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
// import Divider from 'material-ui/Divider';
// import Subheader from 'material-ui/Subheader';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

const SelectableList = makeSelectable(List);

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    //paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
    display: 'block',
    textAlign: 'center',
  }
};

class Menu extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  handleTouchTapHeader = () => {
    //this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  render() {
    const {
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      title,
      style,
    } = this.props;
    const location = this.context.router.location;
    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <Link style={styles.logo} to={'/'} onTouchTap={this.handleTouchTapHeader}>{title}</Link>
        <SelectableList value={window.location.pathname} onChange={onChangeList}>
          <ListItem
            primaryText="核心"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem primaryText="家长" value="/parents" containerElement={<Link to={`/parents`} />} />,
              <ListItem primaryText="医生" value="/doctors" containerElement={<Link to={`/doctors`} />} />,
              <ListItem primaryText="宝宝" value="/babies" containerElement={<Link to={`/babies`} />} />,
              <ListItem primaryText="用户" value="/users" containerElement={<Link to={`/users`} />} />,
            ]}
          />
          <ListItem
            primaryText="文章系统"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem primaryText="文章" value="/article/posts" containerElement={<Link to={`/article/posts`} />} />,
              <ListItem primaryText="分类" value="/article/categories" containerElement={<Link to={`/article/categories`} />} />,
              <ListItem primaryText="评论" value="/article/comments" containerElement={<Link to={`/article/comments`} />} />,
            ]}
          />
          <ListItem primaryText="医院" value="/hospitals" containerElement={<Link to={`/hospitals`} />} />
          <ListItem primaryText="药品说明" value="/drugs" containerElement={<Link to={`/drugs`} />} />
          <ListItem primaryText="行政区域" value="/regions" containerElement={<Link to={`/regions`} />} />
        </SelectableList>
      </Drawer>
    );
  }
}

export default Menu;
