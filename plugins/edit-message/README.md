# edit-message

[`dsh-plugins`](../../) 合集里的插件之一。包名 `@dookoi/dsh-client-ui-edit-message`。

给 **DeepSeek Harness**（`dsh`）Web GUI 加一个能力：**编辑已发送的用户消息，并从那条重新开始对话。**

每条开启 Turn 的用户消息，动作行里会多出一支铅笔。点它，消息气泡就地变成编辑器；`⌘/Ctrl+Enter` 或在编辑器里点发送后，整段对话从改过的文本起重来——原对话移入归档，侧边栏只剩一段干净的续写。

编辑器可拖拽右下角握柄在消息行宽度内改尺寸，方向键微调（按住 Shift 步长更大），双击恢复气泡原宽度。

## 安装

装进你的 web profile，重启即生效——**不需要手改任何 YAML**（本包声明了 `dsh.bundle`，安装时会自动登记为 profile 的一层）。

```sh
# 1) 先拿到仓库
git clone https://github.com/DooKoi/dsh-plugins.git

# 2) 装这一个插件（指向插件目录，不是仓库根）
dsh plugin --profile web add ./dsh-plugins/plugins/edit-message

# 或者从 tarball 装
dsh plugin --profile web add ./dookoi-dsh-client-ui-edit-message-0.1.0.tgz

# 3) 重启
dsh web
```

检查是否登记成功：

```sh
cat "$DSH_HOME/profiles/web/package.json"   # 或 ~/.dsh/profiles/web/package.json
# dsh.profile.bundles 里应出现 @dookoi/dsh-client-ui-edit-message
```

### 卸载

```sh
dsh plugin --profile web remove @dookoi/dsh-client-ui-edit-message
```

## 兼容性

| 项 | 说明 |
|---|---|
| 平台 | 仅 **web**（`dsh.client.platform: "web"`）；桌面端与 CLI 无此功能 |
| 宿主版本 | 开发构建于 `dsh 0.2.1-alpha.2`。与新版（如 `0.2.1-rc.2`）是否兼容未逐一验证，若有异常请回报版本号 |
| 运行时依赖 | 无。client 产物只 `require` 宿主 shell 已冻结共享的 `react` / `react-dom` / `react/jsx-runtime` / `@deepseek-ai/dsh-client-ui-primitives`，因此不额外安装任何包 |
| 必要条件 | 你的 web profile 必须已挂载 `ui-chat`、`ui-workspace`、`locale` 与 Session 控制器（官方 `dsh-web-app` 默认就有） |

## 这个目录里有什么

```
lib/       预构建产物（就是实际加载的东西，已随仓库提交）
  client.js    浏览器侧 bundle：window.__ModuleLoader__.load({ id, factory })
  index.js     宿主侧入口：一行空 apply()，作用是占住 Loader 里的一行
  types/       TypeScript 声明
src/       源码，仅供阅读
cordis.patch.yml   本包作为 profile 层时注册的那一行
```

**为什么 `lib/` 要提交进仓库**：`dsh` 按包名从 node_modules 解析这个包，读的是 `package.json` 的 `exports["./client"]`。从 GitHub 装包时不会为你跑构建，所以产物必须已经在仓库里。

**想自己改源码重建**：构建用的是上游仓库的内部预设（`packages/client/tsdown.client.ts`，依赖 6 个 monorepo 脚本），无法脱离上游单独运行。请回到 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 checkout 里改 `packages/client/ui-edit-message`，再 `tsdown` 出产物。

## 工作原理（一句话）

编辑不是改日志——Session 日志只追加。保存时在被编辑消息**之前** fork 出子会话，把新文本送进子会话并切换过去，然后归档原会话。`src/client/` 里的 `EditAction`（铅笔）、`InlineEditor`（就地编辑器）与 `surface`（气泡接管）就是这条链路的三个面。

## 来源与许可

功能代码来自 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 工作区内的自建包 `@dookoi/dsh-client-ui-edit-message`，与上游发布序列无关；包结构与约定沿用上游，便于后续跟进。

MIT。见 [LICENSE](LICENSE)。
