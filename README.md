# dsh-plugins

自研的 **DeepSeek Harness**（`dsh`）插件合集。每个插件是 `plugins/` 下一个独立包，可以单独安装、单独发布，互不干扰。

## 插件目录

| 插件 | 包名 | 功能 | 平台 |
|---|---|---|---|
| [edit-message](plugins/edit-message) | `@dookoi/dsh-client-ui-edit-message` | 编辑已发送的用户消息，并从该条重新开始对话 | web |

## 安装

`dsh plugin add` 要指向**具体插件目录**，不是仓库根。

```sh
git clone https://github.com/Ashe226/dsh-plugins.git

# 装某一个插件
dsh plugin --profile web add ./dsh-plugins/plugins/edit-message

# 重启生效
dsh web
```

已经 clone 在别处的，把路径换成绝对路径即可。装完可以这样确认：

```sh
cat ~/.dsh/profiles/web/package.json    # dsh.profile.bundles 里应出现对应包名
```

### 卸载

```sh
dsh plugin --profile web remove @dookoi/dsh-client-ui-edit-message
```

## 仓库结构

```
plugins/
  edit-message/            一个插件 = 一个完整 npm 包
    package.json           必备字段：dsh.bundle / dsh.client / files
    cordis.patch.yml       作为 profile 层时注册的那一行 Loader row
    lib/                   预构建产物，随仓库提交（安装时不会为你构建）
    src/                   源码
    README.md              该插件自己的用法与限制
LICENSE
pnpm-workspace.yaml        把 plugins/* 串成一个 workspace，便于批量操作
```

## 新增一个插件

1. 建目录 `plugins/<名字>/`，照 `edit-message` 的 `package.json` 抄一份。
2. 三个字段不能少：
   - `dsh.bundle.patch` 指向本包的 `cordis.patch.yml` —— **这是"装上就能用"的关键**：`dsh plugin add` 会据此把包自动写进 profile 的 bundles 列表，用户不必手改 YAML。
   - `dsh.client`（有界面时）声明依赖的其它 client 包与 `platform`。
   - `files` 必须包含 `lib/client.js`、`lib/index.js`、`lib/types/**/*.d.ts`、`cordis.patch.yml`。
3. `cordis.patch.yml` 用根级 `- insert:` 注册一行，`id` 取插件名。
4. **`lib/` 要提交进仓库**——`dsh` 按包名解析 `exports["./client"]`，从 GitHub 装包时不会跑构建。
5. 在根 README 的插件目录表里加一行。

命名约定：带界面 → `@dookoi/dsh-client-ui-<名字>`；纯工具 / 无界面 → `@dookoi/dsh-tool-<名字>`。

## 为什么要提交 `lib/`

`dsh` 加载插件的方式是按包名从 `node_modules` 解析 `package.json`，读 `exports["./client"]` 拿到预构建的浏览器 bundle，再由宿主以 `/plugins/??<包名>/client.js` 提供。**加载链路里没有构建这一步**，所以产物必须已经在仓库里。

想改源码重建的话，插件的构建预设（`tsdown.client.ts` 里的 `clientBundle()`）依赖上游 monorepo 的一批脚本，无法脱离上游单独运行：回到 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 checkout 里改对应包，`tsdown` 出产物后再拷回来。

## 兼容性

插件构建于 `dsh 0.2.1-alpha.2`。宿主大版本变化时 client 侧的平台共享模块（`react`、`react-dom`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-ui-primitives`）可能调整，届时需要重新构建。每个插件的 README 里写了它自己的额外限制。

## License

MIT，见 [LICENSE](LICENSE)。
