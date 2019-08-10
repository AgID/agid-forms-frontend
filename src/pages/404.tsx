import * as React from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/Seo";
import StaticLayout from "../components/StaticLayout";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <StaticLayout title={t("pages.notfound_page_title")}>
        <SEO title={t("pages.notfound_page_title")} />
        <p>{t("pages.notfound_page_text")}</p>
      </StaticLayout>
    </div>
  );
};

export default NotFoundPage;
