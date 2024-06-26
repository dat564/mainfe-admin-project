/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Suspense } from "react";
import { useCreation, useSafeState } from "ahooks";
import {
  matchRoutes,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProLayout from "@ant-design/pro-layout";
import defaultSettings from "@ant-design/pro-layout/es/defaultSettings";
import { useRecoilValue } from "recoil";
import _ from "lodash";
import memoized from "nano-memoize";
import PageLoading from "@/components/PageLoading";
import { RightContent } from "@/components/GlobalHeader";

import logo from "@/assets/logo.svg";
import { curLocaleLoadAtom } from "@/atoms/locale";
import { transDynamicRouteAtom } from "@/atoms/route";
import { tabsModelAtom } from "@/atoms/tabsModel";
import paramConfig from "@/config/params";
import styles from "./BasicLayout.less";

// 从config里 把 匹配的信息 调出来
// 放这因为activekey 在 prolayout 和 tabroute之间共享。
const pickRoutes = memoized((routes, pathname) => {
  const matches = matchRoutes(routes, { pathname });
  const routeConfig = matches ? matches[matches.length - 1].route : null;
  return {
    routeConfig,
    // matchPath: matches ? matches.map(match => _.replace(match.route.path,'/*','')).join('/') : null // 解决下微端/*路径的问题
    matchPath: routeConfig ? _.replace(routeConfig.key, "/*", "") : null,
  };
});

const BasicLayout = function (props) {
  const location = useLocation();
  const [settings, setSetting] = useSafeState({
    ...defaultSettings,
    fixSiderbar: true,
    fixedHeader: true,
  });
  console.log({ defaultSettings });
  const locale = useRecoilValue(curLocaleLoadAtom);
  const tabsModel = useRecoilValue(tabsModelAtom);

  const navigate = useNavigate();

  // const orgRoute = useRecoilValue(dynamicRouteAtom);
  const route = useRecoilValue(transDynamicRouteAtom);
  console.log("Basic Layout", route);
  // 手工转换下
  // transDynamicConfigAtom 貌似无法触发prolayout 的menu 更新，深表痛心。
  // const route = useCreation(
  //   () => translateNameProperty(orgRoute, locale),
  //   [orgRoute, locale],
  // );

  // 之所以要喂给单独深拷贝喂，因为 https://github.com/umijs/route-utils/pull/10 它好像挺倔，这么反人类的 底裤操作，居然不纠正...
  const feedToProlayoutRoute = useCreation(() => _.cloneDeep(route), [locale]);

  const { routeConfig, matchPath } = pickRoutes(route, location.pathname);

  // console.log('selectkey:', matchPath);
  // use activeKey  ouble render
  // const [activeKey,setActiveKey] = useRecoilState(activeKeyAtom);

  return (
    <div id="prolayout" key="prolayout">
      <ProLayout
        style={{
          minHeight: "100vh",
        }}
        menuDataRender={() => feedToProlayoutRoute}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              // fullPath 为加工过 '/*' 的路径
              navigate(item.fullPath, { replace: true });
            }}
          >
            {dom}
          </div>
        )}
        selectedKeys={[matchPath]}
        // subMenuItemRender={(_, dom) => <div>pre {dom}</div>}
        menuHeaderRender={() => (
          <div
            id="customize_menu_header"
            className={styles.logo}
            onClick={() => {
              window.open("/");
            }}
          >
            <h1>{paramConfig.appName}</h1>
          </div>
        )}
        // title="BKM"
        // logo={logo}
        // locale
        // {...defaultProps}
        // location={{
        //   pathname: '/welcome',
        // }}
        {...settings}
      >
        {/* <PageContainer> */}
        {/* {tabsModel ? ( */}
        {/*   <TabRoute routeConfig={routeConfig} matchPath={matchPath} /> */}
        {/* ) : ( */}
        <div style={{ backgroundColor: "white" }}>
          {/* <Suspense fallback={<PageLoading />}> */}
          <Outlet />
          {/* </Suspense> */}
        </div>
        {/* )} */}
        {/* </PageContainer> */}
      </ProLayout>
    </div>
  );
};

export default BasicLayout;
