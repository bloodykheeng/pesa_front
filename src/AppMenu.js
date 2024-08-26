import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";

const AppSubmenu = (props) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    const onMenuItemClick = (event, item, index) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (index === activeIndex) setActiveIndex(null);
        else setActiveIndex(index);

        if (props.onMenuItemClick) {
            props.onMenuItemClick({
                originalEvent: event,
                item: item,
            });
        }
    };

    const onKeyDown = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            event.preventDefault();
            event.target.click();
        }
    };

    const renderLinkContent = (item) => {
        let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
        let badge = item.badge && <Badge value={item.badge} />;

        return (
            <React.Fragment>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {submenuIcon}
                {badge}
                <Ripple />
            </React.Fragment>
        );
    };

    //
    let { state } = useLocation();
    let componentDetailFromNavLink = state?.componentDetailFromNavLink ? state?.componentDetailFromNavLink : null;

    console.log("componentDetailFromNavLink  ggg :  ", componentDetailFromNavLink);

    const renderLink = (item, i) => {
        let submenuIcon = item.items && (
            <i
                className={`pi pi-fw ${activeIndex === i ? "pi-angle-up" : "pi-angle-down"} menuitem-toggle-icon`}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent NavLink onClick from being triggered
                    onMenuItemClick(e, item, i);
                }}
            ></i>
        );
        let badge = item.badge && <Badge value={item.badge} />;

        const linkContent = (
            <React.Fragment>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {badge}
                {/* {submenuIcon} */}
            </React.Fragment>
        );

        if (item.to) {
            return (
                <div role="menuitem" style={{ display: "flex", width: "100%", alignItems: "center", cursor: "pointer", justifyContent: "space-between" }}>
                    <NavLink
                        key={item?.label}
                        aria-label={item.label}
                        onKeyDown={onKeyDown}
                        role="menuitem"
                        state={{ componentDetailFromNavLink: item }}
                        style={({ isActive }) => ({
                            width: "100%",
                            color: isActive && item.label === componentDetailFromNavLink?.label ? "var(--primary-color)" : "inherit", // Adjust active text color here
                        })}
                        className={({ isActive }) => (isActive && item.label === componentDetailFromNavLink?.label ? "navbar-item active active-sidebar-item-clicked" : "navbar-item")}
                        to={item.to}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent NavLink onClick from being triggered by the submenu icon
                            onMenuItemClick(e, item, i);
                        }}
                        target={item.target}
                    >
                        {linkContent}
                    </NavLink>
                    {submenuIcon}
                </div>
            );
        } else {
            return (
                <a
                    tabIndex="0"
                    aria-label={item.label}
                    onKeyDown={onKeyDown}
                    role="menuitem"
                    href="/"
                    className="p-ripple"
                    onClick={(e) => {
                        e.preventDefault();
                        onMenuItemClick(e, item, i);
                    }}
                    target={item.target}
                >
                    {linkContent}
                    {submenuIcon}
                    <Ripple />
                </a>
            );
        }
    };

    let items =
        props.items &&
        props.items.map((item, i) => {
            let active = activeIndex === i;
            let styleClass = classNames(item.badgeStyleClass, { "layout-menuitem-category": props.root, "active-menuitem": active && !item.to });

            if (props.root) {
                return (
                    <li className={styleClass} key={i} role="none">
                        {props.root === true && (
                            <React.Fragment>
                                <div className="layout-menuitem-root-text" aria-label={item.label}>
                                    {item.label}
                                </div>
                                <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                            </React.Fragment>
                        )}
                    </li>
                );
            } else {
                return (
                    <li className={styleClass} key={i} role="none">
                        {renderLink(item, i)}
                        <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={active} unmountOnExit>
                            <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                        </CSSTransition>
                    </li>
                );
            }
        });

    return items ? (
        <ul className={props.className} role="menu">
            {items}
        </ul>
    ) : null;
};

export const AppMenu = (props) => {
    return (
        <div className="layout-menu-container">
            <AppSubmenu items={props.model} className="layout-menu" onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />
            {/* <a href="https://www.primefaces.org/primeblocks-react" className="block mt-3">
                <img alt="primeblocks" className="w-full" src={props.layoutColorMode === "light" ? "assets/layout/images/banner-primeblocks.png" : "assets/layout/images/banner-primeblocks-dark.png"} />
            </a> */}
        </div>
    );
};
