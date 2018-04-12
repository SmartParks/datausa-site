import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {Dialog} from "@blueprintjs/core";
import {titleCase} from "d3plus-text";
import "./index.css";

import Hamburger from "./Hamburger";

import SearchButton from "./SearchButton";

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      background: false,
      menu: false
    };
    this.scrollBind = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollBind);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollBind);
  }

  handleScroll() {
    const {background} = this.state;
    const newBackground = window.scrollY > 45;

    if (background !== newBackground) {
      this.setState({background: newBackground});
    }
  }

  render() {
    const {background, menu} = this.state;
    const {location, profile} = this.props;

    const logo = !["/"].includes(location.pathname);
    const toggleMenu = () => this.setState({menu: !this.state.menu});

    const search = !(location.pathname === "/" ||
                   location.pathname.indexOf("/search") === 0);

    const splash = location.pathname === "/" ||
                   location.pathname.indexOf("/profile") === 0;

    const dark = !splash;
    console.log(location.pathname);
    const subtitle = location.pathname.indexOf("/profile") === 0
      ? profile ? profile.title.replace("<p>", "").replace("</p>", "") : ""
      : location.pathname === "/" ? false
        : ["/story", "/story/"].includes(location.pathname)
          ? "Stories"
          : titleCase(location.pathname.split("/")[1]);

    return <nav id="Nav" className={ `${background || dark ? "background" : ""} ${menu ? "menu" : ""}` }>

      <div className="menu-btn" onClick={ toggleMenu }>
        <Hamburger isOpen={ menu } />
        <span className={ menu ? "label open" : "label" }>Menu</span>
      </div>

      { logo || (dark || background)
        ? <Link to="/" className="home-btn">
          <img src="/images/logo_sm.png" alt="Data USA" />
        </Link>
        : null }

      { subtitle && (dark || background)
        ? <span className="nav-subtitle">{ subtitle }</span>
        : null }

      { search
        ? <SearchButton />
        : null }

      <Dialog className="nav-menu" lazy={false} isOpen={ menu } onClose={ toggleMenu } transitionName={ "slide" }>
        <div className="menu-content">
          <ul>
            <li>
              <Link to="/search/">Explore</Link>
              <ul>
                <li><Link to="/search/?kind=geo">Locations</Link></li>
                <li><Link to="/search/?kind=naics">Industries</Link></li>
                <li><Link to="/search/?kind=soc">Occupations</Link></li>
                <li><Link to="/search/?kind=cip">Majors</Link></li>
                <li><Link to="/search/?kind=university">Universities</Link></li>
              </ul>
            </li>
            <li>
              <Link to="/story/">Stories</Link>
            </li>
            <li>
              <Link to="/map/">Maps</Link>
            </li>
            <li>
              <Link to="/cart/">Data Cart</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/about/datasets/">Data Sources</Link>
            </li>
          </ul>
          { logo ? <div className="menu-collab">
            <a target="_blank" rel="noopener noreferrer" href="http://www2.deloitte.com/us/en.html"><img id="deloitte" src="/images/footer/deloitte.png" /></a>
            <a target="_blank" rel="noopener noreferrer" href="http://macro.media.mit.edu/"><img id="mit" src="/images/footer/mit.png" /></a>
            <a target="_blank" rel="noopener noreferrer" href="http://www.datawheel.us/"><img id="datawheel" src="/images/footer/datawheel.png" /></a>
          </div> : null }
        </div>
      </Dialog>
    </nav>;
  }

}

export default connect(state => ({
  profile: state.data.profile
}))(Nav);
