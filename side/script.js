import React, { createContext, StrictMode, useContext, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
const ToolbarContext = createContext(undefined);
const ToolbarProvider = ({ children }) => {
	const [tool, setTool] = useState("select");
	return (React.createElement(ToolbarContext.Provider, { value: { tool, setTool } }, children));
};
const useTool = () => {
	const context = useContext(ToolbarContext);
	if (!context) {
		throw new Error("useTool must be used inside ToolbarProvider");
	}
	return context;
};
const h = React.createElement;

createRoot(document.getElementById("root"))
	.render(h(StrictMode, null,
		h("main", { className: "app-shell" },
			h(ToolbarIconSprites, null),
			h(Sidebar, null),
			h("section", { className: "toolbar-panel", "aria-label": "Toolbar demo" },
				h(ToolbarProvider, null,
					h(Toolbar, { name: "Horizontal" })),
				h(ToolbarProvider, null,
					h(Toolbar, { name: "Vertical", orientation: "vertical" }))
			)
		)
	));

function Toolbar({ name, orientation = "horizontal" }) {
	const { tool, setTool } = useTool();
	const [toolPrev, setToolPrev] = useState(tool);
	const toolbarRef = useRef(null);
	const animRef = useRef(null);
	const isRTL = document.dir === "rtl";
	const isVertical = orientation === "vertical";
	const tools = [{
			icon: "select",
			label: "Select",
			tool: "select"
		},
		{
			icon: "draw",
			label: "Draw",
			tool: "draw"
		},
		{
			icon: "fill",
			label: "Fill",
			tool: "fill"
		},
		{
			icon: "erase",
			label: "Erase",
			tool: "erase"
		}
	];

	function handleKeyDown(e) {
		var _a;
		const toolButtons = (_a = toolbarRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[tabindex]");
		if (!toolButtons)
			return;
		const toolIndex = tools.findIndex(item => item.tool === tool);
		const forward = () => {
			e.preventDefault();
			const nextToolIndex = (toolIndex + 1) % tools.length;
			const toolName = tools[nextToolIndex].tool;
			setTool(() => {
				reAnimate(toolName);
				return toolName;
			});
			toolButtons[nextToolIndex].focus();
		};
		const backward = () => {
			e.preventDefault();
			let prevToolIndex = toolIndex - 1;
			if (prevToolIndex < 0)
				prevToolIndex = tools.length - 1;
			const toolName = tools[prevToolIndex].tool;
			setTool(() => {
				reAnimate(toolName);
				return toolName;
			});
			toolButtons[prevToolIndex].focus();
		};
		switch (e.code) {
			case "ArrowRight": {
				if (isRTL) {
					backward();
				}
				else {
					forward();
				}
				break;
			}
			case "ArrowDown": {
				forward();
				break;
			}
			case "ArrowLeft": {
				if (isRTL) {
					forward();
				}
				else {
					backward();
				}
				break;
			}
			case "ArrowUp": {
				backward();
				break;
			}
			case "Home": {
				e.preventDefault();
				const toolName = tools[0].tool;
				setTool(() => {
					reAnimate(toolName);
					return toolName;
				});
				toolButtons[0].focus();
				break;
			}
			case "End": {
				e.preventDefault();
				const toolName = tools[tools.length - 1].tool;
				setTool(() => {
					reAnimate(toolName);
					return toolName;
				});
				toolButtons[tools.length - 1].focus();
				break;
			}
			default:
				break;
		}
	};

	function reAnimate(tool) {
		var _a;
		const toolIndex = tools.findIndex(item => item.tool === tool);
		const toolPrevIndex = tools.findIndex(item => item.tool === toolPrev);
		const highlightWidth = 1.75;
		const highlightMoveIncrement = 1.875;
		const highlightmoveA = highlightMoveIncrement * toolPrevIndex;
		const highlightmoveB = highlightMoveIncrement * toolIndex;
		const indexIsLower = toolIndex < toolPrevIndex;
		// movement
		const moveA = `${highlightmoveA}em`;
		const moveB = `${highlightmoveB}em`;
		const moveKey = isVertical ? "top" : (isRTL ? "right" : "left");
		const move = indexIsLower ? [moveA, moveB, moveB] : [moveA, moveA, moveB];
		// width
		const widthA = `${highlightWidth}em`;
		const widthB = `${highlightWidth + highlightMoveIncrement * Math.abs(toolIndex - toolPrevIndex)}em`;
		const widthKey = isVertical ? "height" : "width";
		const width = [widthA, widthB, widthA];
		// build the keyframes
		const keyframes = {};
		keyframes[moveKey] = move;
		keyframes[widthKey] = width;
		(_a = animRef.current) === null || _a === void 0 ? void 0 : _a.animate(keyframes, {
			duration: 300,
			easing: "cubic-bezier(0.65,0,0.35,1)",
			fill: "forwards"
		});
		setToolPrev(tool);
	}
	return (React.createElement("div", { className: `toolbar${isVertical ? " toolbar--vertical" : ""}`, role: "toolbar", "aria-label": name, "aria-orientation": orientation, onKeyDown: handleKeyDown, ref: toolbarRef },
		tools.map((item, i) => {
			const { icon, label, tool } = item;
			return (React.createElement(ToolbarButton, { label: label, toolName: tool, toolChangeEffect: reAnimate, key: i },
				React.createElement(ToolbarIcon, { icon: icon })));
		}),
		React.createElement("div", { className: "toolbar__highlight", ref: animRef })));
}

function ToolbarButton({ label, toolName, toolChangeEffect, children }) {
	const { tool, setTool } = useTool();
	const pressed = toolName === tool;

	function runtoolChangeEffect() {
		setTool(() => {
			toolChangeEffect(toolName);
			return toolName;
		});
	}
	return (React.createElement("button", { className: "toolbar__button", type: "button", "aria-label": label, "aria-pressed": pressed, tabIndex: pressed ? 0 : -1, onClick: runtoolChangeEffect },
		children,
		React.createElement("span", { className: "toolbar__button-tip" }, label)));
}

function ToolbarIcon({ icon }) {
	return (React.createElement("svg", { className: "toolbar__icon", width: "16px", height: "16px", "aria-hidden": "true" },
		React.createElement("use", { href: `#${icon}` })));
}

function ToolbarIconSprites() {
	return (React.createElement("svg", { width: "0", height: "0", "aria-hidden": "true" },
		React.createElement("symbol", { id: "select", viewBox: "0 0 24 24" },
			React.createElement("polygon", { fill: "currentcolor", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", points: "12 4,5 20,12 16,19 20", transform: "translate(0,0) rotate(-30,12,12)" })),
		React.createElement("symbol", { id: "draw", viewBox: "0 0 24 24" },
			React.createElement("g", { fill: "currentColor" },
				React.createElement("path", { d: "M17.0671 2.27157C17.5 2.09228 17.9639 2 18.4324 2C18.9009 2 19.3648 2.09228 19.7977 2.27157C20.2305 2.45086 20.6238 2.71365 20.9551 3.04493C21.2864 3.37621 21.5492 3.7695 21.7285 4.20235C21.9077 4.63519 22 5.09911 22 5.56761C22 6.03611 21.9077 6.50003 21.7285 6.93288C21.5492 7.36572 21.2864 7.75901 20.9551 8.09029L20.4369 8.60845L15.3916 3.56308L15.9097 3.04493C16.241 2.71365 16.6343 2.45086 17.0671 2.27157Z" }),
				React.createElement("path", { d: "M13.9774 4.9773L3.6546 15.3001C3.53154 15.4231 3.44273 15.5762 3.39694 15.7441L2.03526 20.7369C1.94084 21.0831 2.03917 21.4534 2.29292 21.7071C2.54667 21.9609 2.91693 22.0592 3.26314 21.9648L8.25597 20.6031C8.42387 20.5573 8.57691 20.4685 8.69996 20.3454L19.0227 10.0227L13.9774 4.9773Z" }))),
		React.createElement("symbol", { id: "fill", viewBox: "0 -32 576 576" },
			React.createElement("g", { fill: "currentColor" },
				React.createElement("path", { d: "M512 320s-64 92.65-64 128c0 35.35 28.66 64 64 64s64-28.65 64-64-64-128-64-128zm-9.37-102.94L294.94 9.37C288.69 3.12 280.5 0 272.31 0s-16.38 3.12-22.62 9.37l-81.58 81.58L81.93 4.76c-6.25-6.25-16.38-6.25-22.62 0L36.69 27.38c-6.24 6.25-6.24 16.38 0 22.62l86.19 86.18-94.76 94.76c-37.49 37.48-37.49 98.26 0 135.75l117.19 117.19c18.74 18.74 43.31 28.12 67.87 28.12 24.57 0 49.13-9.37 67.87-28.12l221.57-221.57c12.5-12.5 12.5-32.75.01-45.25zm-116.22 70.97H65.93c1.36-3.84 3.57-7.98 7.43-11.83l13.15-13.15 81.61-81.61 58.6 58.6c12.49 12.49 32.75 12.49 45.24 0s12.49-32.75 0-45.24l-58.6-58.6 58.95-58.95 162.44 162.44-48.34 48.34z" }))),
		React.createElement("symbol", { id: "erase", viewBox: "0 0 24 24" },
			React.createElement("g", { fill: "currentColor" },
				React.createElement("path", { d: "M21.0302 22H13.9902C13.5702 22 13.2402 21.66 13.2402 21.25C13.2402 20.84 13.5802 20.5 13.9902 20.5H21.0302C21.4502 20.5 21.7802 20.84 21.7802 21.25C21.7802 21.66 21.4502 22 21.0302 22Z" }),
				React.createElement("path", { d: "M13.64 16.6894C14.03 17.0794 14.03 17.7094 13.64 18.1094L10.66 21.0894C9.55 22.1994 7.77 22.2594 6.59 21.2694C6.52 21.2094 6.46 21.1494 6.4 21.0894L5.53 20.2194L3.74 18.4294L2.88 17.5694C2.81 17.4994 2.75 17.4294 2.69 17.3594C1.71 16.1794 1.78 14.4194 2.88 13.3194L5.86 10.3394C6.25 9.94938 6.88 9.94938 7.27 10.3394L13.64 16.6894Z" }),
				React.createElement("path", { d: "M21.1194 10.6414L16.1194 15.6414C15.7294 16.0314 15.0994 16.0314 14.7094 15.6414L8.33937 9.29141C7.94938 8.90141 7.94938 8.27141 8.33937 7.87141L13.3394 2.88141C14.5094 1.71141 16.4294 1.71141 17.5994 2.88141L21.1194 6.39141C22.2894 7.56141 22.2894 9.47141 21.1194 10.6414Z" })))));
};

const COLORS = {
	orange: "#ee4503",
	dark: "#020011",
	bg: "#f3f3f3",
	white: "#ffffff",
	grayLight: "#e0e0e0",
	textMuted: "#6b6b6b"
};

const navItems = [
	{ id: "home", label: "Home", icon: HomeIcon, badge: null },
	{ id: "task", label: "Task", icon: TaskIcon, badge: 12 },
	{ id: "activity", label: "Activity", icon: ActivityIcon, badge: null },
	{ id: "users", label: "Users", icon: UsersIcon, badge: null },
	{ id: "notification", label: "Notification", icon: BellIcon, badge: 14 }
];
const bottomItems = [
	{ id: "setting", label: "Setting", icon: SettingIcon },
	{ id: "support", label: "Support", icon: SupportIcon }
];
const groupItems = [
	{ id: "figma", label: "Figma Files", icon: FigmaIcon, color: "#9b59b6" },
	{ id: "downloads", label: "Downloads", icon: DownloadIcon, color: "#3498db" },
	{ id: "costs", label: "Costs", icon: CostsIcon, color: "#e74c3c" },
	{ id: "gifts", label: "Gifts", icon: GiftIcon, color: "#f39c12" }
];

function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const [active, setActive] = useState("task");
	const [dark, setDark] = useState(true);
	const theme = {
		bg: dark ? COLORS.dark : COLORS.white,
		surface: dark ? "#0d0a1a" : COLORS.bg,
		text: dark ? COLORS.white : COLORS.dark,
		muted: dark ? "#8b8fa8" : COLORS.textMuted,
		border: dark ? "#1e1a2e" : COLORS.grayLight,
		searchBg: dark ? "#1a1530" : COLORS.grayLight,
		itemHover: dark ? "#1a1530" : "#f0f0f0"
	};
	return h("div", { className: "sidebar-stage", style: { background: dark ? "#0a0818" : COLORS.bg } },
		h("style", null, `
            @import url('https://api.fontshare.com/v2/css?f[]=chillax@400,500,600&display=swap');
            .sidebar-stage * { box-sizing: border-box; }
.sidebar-stage { min-height: 100vh; display: flex; align-items: stretch; justify-content: flex-start; font-family: Chillax, system-ui, sans-serif; padding: 0; }
.sidebar { position: relative; height: 100vh; border-radius: 0; overflow: visible; transition: width .35s cubic-bezier(.22,1,.36,1); box-shadow: 0 24px 64px rgba(0,0,0,.35), 0 4px 16px rgba(0,0,0,.2); display: flex; flex-direction: column; flex-shrink: 0; }
            .sidebar-inner { display: flex; flex-direction: column; height: 100%; padding: 20px 14px; overflow: hidden; }
            .toggle-btn { position: absolute; top: 50%; right: -14px; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 50%; background: ${COLORS.orange}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 8px rgba(238,69,3,.5); transition: transform .2s ease, background .2s; flex-shrink: 0; }
            .toggle-btn:hover { background: #ff5511; transform: translateY(-50%) scale(1.1); }
            .nav-item, .group-item { display: flex; align-items: center; cursor: pointer; position: relative; white-space: nowrap; user-select: none; }
            .nav-item { gap: 12px; padding: 10px 12px; border-radius: 12px 6px; transition: all .2s ease; text-decoration: none; }
            .nav-item:hover, .group-item:hover, .user-section:hover { background: var(--item-hover); }
            .nav-item.active { background: ${COLORS.orange}18; color: ${COLORS.orange} !important; }
            .nav-icon { width: 20px; height: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
            .badge { margin-left: auto; background: ${COLORS.orange}; color: white; font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 20px; flex-shrink: 0; min-width: 22px; text-align: center; }
            .tooltip { position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%); background: ${COLORS.dark}; color: white; font-size: 12px; font-weight: 500; padding: 5px 10px; border-radius: 6px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity .15s; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,.3); }
            .nav-item:hover .tooltip, .group-item:hover .tooltip, .search-box:hover .tooltip, .user-section:hover .tooltip { opacity: 1; }
            .section-label { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; padding: 6px 12px 4px; white-space: nowrap; overflow: hidden; transition: opacity .2s, max-height .3s; }
            .label-text { transition: opacity .2s .05s, width .3s; white-space: nowrap; overflow: hidden; }
            .search-box { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 10px; margin-bottom: 16px; transition: all .2s; cursor: text; flex-shrink: 0; position: relative; }
            .search-input { background: none; border: none; outline: none; font-family: inherit; font-size: 13px; width: 100%; transition: opacity .2s; color: inherit; }
            .theme-toggle { display: flex; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
            .theme-btn { flex: 1; padding: 8px 10px; border: none; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all .2s; white-space: nowrap; }
            .group-item { gap: 10px; padding: 9px 12px; border-radius: 10px 5px; transition: background .2s; }
            .group-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .divider { height: 1px; margin: 10px 4px; flex-shrink: 0; }
            .scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }
            .scroll-area::-webkit-scrollbar { display: none; }
            .user-section { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; cursor: pointer; transition: background .2s; flex-shrink: 0; overflow: hidden; position: relative; }
            .avatar { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, ${COLORS.orange}, #ff8c42); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; flex-shrink: 0; letter-spacing: -.5px; }
        `),
		h("div", { className: "sidebar", style: { width: collapsed ? 68 : 260, background: theme.bg, "--item-hover": theme.itemHover } },
			h("button", { className: "toggle-btn", onClick: () => setCollapsed(!collapsed), "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar" },
				h("svg", { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none" },
					h("path", { d: collapsed ? "M4 2l4 4-4 4" : "M8 2L4 6l4 4", stroke: "white", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }))),
			h("div", { className: "sidebar-inner" },
				h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "4px 6px 18px", overflow: "hidden" } },
					h("div", { style: { width: 34, height: 34, borderRadius: "10px 5px", background: `linear-gradient(135deg, ${COLORS.orange}, #ff6b1a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, iconSvg("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", "white", 18, 18, "none")),
					h("div", { style: hiddenStyle(collapsed) },
						h("div", { style: { fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: "-.3px" } }, "PlanB"),
						h("div", { style: { fontSize: 11, color: theme.muted, marginTop: 1 } }, "Creative Studio"))),
				h("div", { className: "search-box", style: { background: theme.searchBg, color: theme.text } }, SearchIcon(15, theme.muted), !collapsed && h("input", { className: "search-input", placeholder: "Search..." }), collapsed && h("div", { className: "tooltip" }, "Search")),
				h("div", { className: "scroll-area" },
					h("div", { className: "section-label", style: { color: theme.muted, opacity: collapsed ? 0 : 1, maxHeight: collapsed ? 0 : 30 } }, "Menu"),
					navItems.map(item => NavItem(item, active, setActive, collapsed, theme)),
					h("div", { className: "divider", style: { background: theme.border } }),
					bottomItems.map(item => NavItem(item, active, setActive, collapsed, theme)),
					h("div", { className: "divider", style: { background: theme.border } }),
					h("div", { className: "section-label", style: { color: theme.muted, opacity: collapsed ? 0 : 1, maxHeight: collapsed ? 0 : 30 } }, "Group"),
					groupItems.map(item => GroupItem(item, collapsed, theme))
				),
				h("div", { style: { marginTop: 12, marginBottom: 12 } },
					h("div", { className: "theme-toggle", style: { background: theme.searchBg } },
						h("button", { className: "theme-btn", style: { background: !dark ? COLORS.white : "transparent", color: !dark ? COLORS.dark : theme.muted, borderRadius: 10, boxShadow: !dark ? "0 2px 8px rgba(0,0,0,.1)" : "none" }, onClick: () => setDark(false) }, SunIcon(13), !collapsed && "Light"),
						h("button", { className: "theme-btn", style: { background: dark ? COLORS.dark : "transparent", color: dark ? COLORS.white : theme.muted, borderRadius: 10, boxShadow: dark ? "0 2px 8px rgba(0,0,0,.3)" : "none" }, onClick: () => setDark(true) }, MoonIcon(13), !collapsed && "Dark"))),
				h("div", { className: "user-section", style: { "--item-hover": theme.itemHover } },
					h("div", { className: "avatar" }, "PB"),
					h("div", { style: { ...hiddenStyle(collapsed), flex: 1 } },
						h("div", { style: { fontSize: 13, fontWeight: 600, color: theme.text } }, "planb.design"),
						h("div", { style: { fontSize: 11, color: theme.muted, marginTop: 1 } }, "planb@studio.io")),
					!collapsed && iconSvg("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", theme.muted, 16, 16, "none"),
					collapsed && h("div", { className: "tooltip" }, "planb.design"))
			)
		)
	);
}

function hiddenStyle(collapsed) {
	return { overflow: "hidden", whiteSpace: "nowrap", opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", transition: "opacity .15s, width .3s cubic-bezier(.22,1,.36,1)" };
}

function NavItem(item, active, setActive, collapsed, theme) {
	const Icon = item.icon;
	const isActive = active === item.id;
	return h("div", { key: item.id, className: `nav-item ${isActive ? "active" : ""}`, style: { color: isActive ? COLORS.orange : theme.text }, onClick: () => setActive(item.id) },
		h("span", { className: "nav-icon" }, h(Icon, { size: 18, color: isActive ? COLORS.orange : theme.muted })),
		h("span", { className: "label-text", style: { opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", fontSize: 14, fontWeight: 500, overflow: "hidden" } }, item.label),
		item.badge && !collapsed && h("span", { className: "badge" }, item.badge),
		item.badge && collapsed && h("div", { style: { position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: COLORS.orange } }),
		collapsed && h("div", { className: "tooltip" }, `${item.label}${item.badge ? ` (${item.badge})` : ""}`)
	);
}

function GroupItem(item, collapsed, theme) {
	const Icon = item.icon;
	return h("div", { key: item.id, className: "group-item", style: { color: theme.text } },
		h("div", { className: "group-icon", style: { background: item.color + "22" } }, h(Icon, { size: 14, color: item.color })),
		h("span", { style: { fontSize: 14, fontWeight: 500, opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", overflow: "hidden", whiteSpace: "nowrap", transition: "opacity .15s, width .3s", flex: 1 } }, item.label),
		!collapsed && iconSvg("M9 18l6-6-6-6", theme.muted, 14, 14, "none"),
		collapsed && h("div", { className: "tooltip" }, item.label)
	);
}

function iconSvg(d, color = "currentColor", width = 18, height = 18, fill = "none") {
	return h("svg", { width, height, viewBox: "0 0 24 24", fill }, h("path", { d, stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }));
}

function SearchIcon(size, color) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", style: { flexShrink: 0 } }, h("circle", { cx: 11, cy: 11, r: 8, stroke: color, strokeWidth: 2 }), h("path", { d: "m21 21-4.35-4.35", stroke: color, strokeWidth: 2, strokeLinecap: "round" })); }

function SunIcon(size) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("circle", { cx: 12, cy: 12, r: 5, stroke: "currentColor", strokeWidth: 2 }), h("path", { d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })); }

function MoonIcon(size) { return iconSvg("M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", "currentColor", size, size, "none"); }

function HomeIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }), h("polyline", { points: "9 22 9 12 15 12 15 22", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })); }

function TaskIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("rect", { x: 3, y: 3, width: 18, height: 18, rx: 3, stroke: color, strokeWidth: 2 }), h("path", { d: "M9 12l2 2 4-4", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })); }

function ActivityIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })); }

function UsersIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", stroke: color, strokeWidth: 2, strokeLinecap: "round" }), h("circle", { cx: 9, cy: 7, r: 4, stroke: color, strokeWidth: 2 }), h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", stroke: color, strokeWidth: 2, strokeLinecap: "round" })); }

function BellIcon({ size = 18, color = "currentColor" }) { return iconSvg("M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0", color, size, size, "none"); }

function SettingIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("circle", { cx: 12, cy: 12, r: 3, stroke: color, strokeWidth: 2 }), h("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z", stroke: color, strokeWidth: 2 })); }

function SupportIcon({ size = 18, color = "currentColor" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("circle", { cx: 12, cy: 12, r: 10, stroke: color, strokeWidth: 2 }), h("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })); }

function FigmaIcon({ size = 14, color = "#9b59b6" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("path", { d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zM12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zM5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5zM5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z", stroke: color, strokeWidth: 2 })); }

function DownloadIcon({ size = 14, color = "#3498db" }) { return iconSvg("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", color, size, size, "none"); }

function CostsIcon({ size = 14, color = "#e74c3c" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("circle", { cx: 12, cy: 12, r: 10, stroke: color, strokeWidth: 2 }), h("path", { d: "M12 6v2M12 16v2M8 12h1l3-3 3 3h1", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })); }

function GiftIcon({ size = 14, color = "#f39c12" }) { return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" }, h("polyline", { points: "20 12 20 22 4 22 4 12", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }), h("rect", { x: 2, y: 7, width: 20, height: 5, rx: 1, stroke: color, strokeWidth: 2 }), h("line", { x1: 12, y1: 22, x2: 12, y2: 7, stroke: color, strokeWidth: 2 }), h("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z", stroke: color, strokeWidth: 2 })); }