<!-- 绿色 -->

:root {
--bg-color: #ffffff; /_ 页面整体背景色（亮色模式） _/
--text-color: #333333; /_ 主文本颜色（亮色模式） _/
--button-bg: #4CAF50; /_ 按钮背景色（亮色模式） _/
--button-text-color: #ffffff; /_ 按钮文字颜色 _/
--card-bg: #f4f4f4; /_ 卡片背景色（亮色模式） _/
--link-color: #1E90FF; /_ 超链接颜色 _/

/_ ✅ 辅助变量 _/
--border-color: #dddddd; /_ 元素边框颜色 _/
--input-bg: #ffffff; /_ 输入框背景色 _/
--input-text: #333333; /_ 输入框文字颜色 _/
--input-border: #cccccc; /_ 输入框边框颜色 _/
--hover-bg: #f0f0f0; /_ 悬浮时的背景色（如卡片、按钮 hover） _/
--shadow-color: rgba(0, 0, 0, 0.1);/_ 阴影颜色（用于卡片、弹窗等） _/
--header-bg: #f8f8f8; /_ 顶部导航栏背景色 _/
--footer-bg: #f8f8f8; /_ 页脚背景色 _/

/_ ✅ 新增提示状态变量 _/
--success-color: #2ecc71; /_ 成功状态颜色 _/
--warning-color: #f39c12; /_ 警告状态颜色 _/
--error-color: #e74c3c; /_ 错误状态颜色 _/

/_ ✅ 滚动条颜色（可选） _/
--scrollbar-bg: #eeeeee; /_ 滚动条背景 _/
--scrollbar-thumb: #cccccc; /_ 滚动条滑块颜色 _/
}

html.dark {
--bg-color: #121212; /_ 页面背景色（暗色模式） _/
--text-color: #e0e0e0; /_ 主文本颜色（暗色模式） _/
--button-bg: #4CAF50; /_ 按钮背景色（暗色模式仍可复用亮色） _/
--button-text-color: #ffffff; /_ 按钮文字颜色 _/
--card-bg: #2c2c2c; /_ 卡片背景色（暗色模式） _/
--link-color: #1E90FF; /_ 超链接颜色 _/

/_ ✅ 辅助变量 _/
--border-color: #444444; /_ 元素边框颜色 _/
--input-bg: #1e1e1e; /_ 输入框背景色（暗色） _/
--input-text: #e0e0e0; /_ 输入框文字颜色（暗色） _/
--input-border: #555555; /_ 输入框边框颜色（暗色） _/
--hover-bg: #2a2a2a; /_ 悬浮背景色（暗色模式） _/
--shadow-color: rgba(0, 0, 0, 0.4);/_ 阴影颜色（暗色模式） _/
--header-bg: #1a1a1a; /_ 顶部导航背景（暗色） _/
--footer-bg: #1a1a1a; /_ 页脚背景（暗色） _/

/_ ✅ 状态色（暗色下保持相同） _/
--success-color: #2ecc71;
--warning-color: #f39c12;
--error-color: #e74c3c;

/_ ✅ 滚动条颜色 _/
--scrollbar-bg: #2a2a2a;
--scrollbar-thumb: #555555;
}

<!-- 蓝色 -->

:root {
/_ 亮色模式配色 _/
--bg-color: #f8f9fa; /_ 更柔和的背景白色 _/
--text-color: #2d3748; /_ 深灰蓝色，更舒适的阅读色 _/
--button-bg: #4f46e5; /_ 靛蓝色按钮，更现代 _/
--button-text-color: #ffffff;  
 --card-bg: #ffffff; /_ 纯白卡片 _/
--link-color: #2563eb; /_ 更深的蓝色链接 _/

/_ 辅助变量 _/
--border-color: #e2e8f0; /_ 更浅的灰色边框 _/
--input-bg: #ffffff;  
 --input-text: #2d3748;  
 --input-border: #cbd5e0; /_ 中等灰色边框 _/
--hover-bg: #edf2f7; /_ 非常浅的蓝色悬停背景 _/
--shadow-color: rgba(0, 0, 0, 0.05); /_ 更柔和的阴影 _/
--header-bg: #ffffff; /_ 白色顶部栏 _/
--footer-bg: #f1f5f9; /_ 浅灰色页脚 _/

/_ 状态色 _/
--success-color: #10b981; /_ 翠绿色 _/
--warning-color: #f59e0b; /_ 琥珀色 _/
--error-color: #ef4444; /_ 红色 _/

/_ 滚动条 _/
--scrollbar-bg: #e2e8f0;
--scrollbar-thumb: #cbd5e0;
}

html.dark {
/_ 暗色模式配色 _/
--bg-color: #1a202c; /_ 深灰蓝色背景 _/
--text-color: #e2e8f0; /_ 浅灰蓝色文本 _/
--button-bg: #6366f1; /_ 稍亮的靛蓝色 _/
--button-text-color: #ffffff;
--card-bg: #2d3748; /_ 深蓝色卡片 _/
--link-color: #4299e1; /_ 亮蓝色链接 _/

/_ 辅助变量 _/
--border-color: #4a5568; /_ 中等灰蓝色边框 _/
--input-bg: #2d3748;
--input-text: #e2e8f0;
--input-border: #4a5568;
--hover-bg: #2d3748; /_ 卡片颜色作为悬停背景 _/
--shadow-color: rgba(0, 0, 0, 0.3);
--header-bg: #1a202c;
--footer-bg: #1a202c;

/_ 状态色保持相同或微调 _/
--success-color: #10b981;
--warning-color: #f59e0b;
--error-color: #ef4444;

/_ 滚动条 _/
--scrollbar-bg: #2d3748;
--scrollbar-thumb: #4a5568;
}

<!-- 上述修改后 -->

:root {
/_ 亮色模式 - 灵感来自自然光感 _/
--bg-color: #f5f7fa; /_ 柔和的灰白底色，类似自然光 _/
--text-color: #1e293b; /_ 深蓝灰色，更柔和的阅读色 _/
--button-bg: #6366f1; /_ 舒适的靛蓝色 _/
--button-text-color: #f8fafc; /_ 极浅灰白 _/
--card-bg: #ffffff; /_ 纯净白色卡片 _/
--link-color: #4f46e5; /_ 与按钮呼应的链接色 _/

/_ 辅助色 - 精心调制的灰度 _/
--border-color: #e2e8f0; /_ 极浅蓝灰 _/
--input-bg: #ffffff;
--input-text: #1e293b;
--input-border: #cbd5e0; /_ 中等浅灰 _/
--hover-bg: #f1f5f9; /_ 极浅蓝灰悬停 _/
--shadow-color: rgba(149, 157, 165, 0.1); /_ GitHub 风格的柔和阴影 _/
--header-bg: #ffffff; /_ 纯白顶部栏 _/
--footer-bg: #f1f5f9; /_ 浅灰白页脚 _/

/_ 状态色 - 精心挑选的和谐配色 _/
--success-color: #10b981; /_ 翡翠绿 _/
--warning-color: #f59e0b; /_ 琥珀橙 _/
--error-color: #ef4444; /_ 番茄红 _/
--info-color: #3b82f6; /_ 新增信息蓝 _/

/_ 新增渐变配色 _/
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/_ 滚动条 _/
--scrollbar-bg: #e2e8f0;
--scrollbar-thumb: #94a3b8;
}

html.dark {
/_ 暗色模式 - 深空蓝主题 _/
--bg-color: #0f172a; /_ 深空蓝背景 _/
--text-color: #e2e8f0; /_ 雾白色 _/
--button-bg: #818cf8; /_ 更亮的靛蓝 _/
--button-text-color: #f8fafc;
--card-bg: #1e293b; /_ 深蓝灰卡片 _/
--link-color: #818cf8; /_ 亮靛蓝链接 _/

/_ 辅助色 _/
--border-color: #334155; /_ 深蓝灰边框 _/
--input-bg: #1e293b;
--input-text: #e2e8f0;
--input-border: #475569;
--hover-bg: #1e293b; /_ 卡片色悬停 _/
--shadow-color: rgba(2, 6, 23, 0.5); /_ 更深阴影 _/
--header-bg: #0f172a;
--footer-bg: #0f172a;

/_ 状态色 - 暗色模式下微调 _/
--success-color: #34d399; /_ 更亮的翡翠绿 _/
--warning-color: #fbbf24; /_ 更亮的琥珀色 _/
--error-color: #f87171; /_ 更柔和的红色 _/
--info-color: #60a5fa; /_ 更亮的信息蓝 _/

/_ 暗色渐变 _/
--gradient-primary: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);

/_ 滚动条 _/
--scrollbar-bg: #1e293b;
--scrollbar-thumb: #475569;
}
