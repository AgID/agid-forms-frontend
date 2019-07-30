import { Link } from "gatsby";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { Trans } from "react-i18next";
import { getSiteConfig } from "../graphql/gatsby";
import Icon from "./Icon";

type FooterProps = Pick<
  NonNullable<ReturnType<typeof getSiteConfig>>,
  // tslint:disable-next-line: max-union-size
  | "footerLinks"
  | "socialLinks"
  | "author"
  | "authorLogo"
  | "authorUrl"
  | "hotjar"
> & { id: string };

const Footer = ({
  footerLinks,
  socialLinks,
  author,
  authorLogo,
  authorUrl,
  hotjar,
  ...props
}: FooterProps) => {
  return (
    <footer className="neutral-1-bg-a9" {...props}>
      <Container>
        <Row className="py-4">
          <Col xs="12" sm="6" md="4">
            <div className="px-2 py-3">
              <a href={authorUrl || ""} target="_blank">
                <img
                  src={authorLogo || ""}
                  alt={author || ""}
                  height="36"
                  style={{ maxWidth: `100%` }}
                />
              </a>
            </div>
          </Col>
          <Col xs="12" sm="6" md="4" className="d-flex">
            <div className="px-2 py-2" />
          </Col>
          <Col xs="12" sm="6" md="4" className="text-white text-right pt-2">
            {socialLinks && socialLinks[0] && socialLinks[0]!.name && (
              <span>
                <Trans i18nKey="follow_us" />
              </span>
            )}
            {(socialLinks || []).map(
              socialLink =>
                socialLink &&
                socialLink.icon &&
                socialLink.name &&
                socialLink.url && (
                  <a
                    className="text-white p-2"
                    key={socialLink.icon}
                    href={socialLink.url}
                    aria-label={socialLink.name}
                  >
                    <Icon
                      icon={socialLink.icon}
                      className="icon-sm icon-light align-top"
                    />
                  </a>
                )
            )}
          </Col>
        </Row>
        <Row className="py-4 border-white border-top">
          <ul className="col list-inline small">
            {(footerLinks || []).map(
              footerLink =>
                footerLink &&
                footerLink.name &&
                footerLink.url && (
                  <li key={footerLink.name} className="list-inline-item px-1">
                    <Link
                      className="small-prints font-weight-bold"
                      style={{ color: "#0bd9d2" }}
                      to={footerLink.url}
                    >
                      {footerLink.name}
                    </Link>
                  </li>
                )
            )}
            {hotjar && hotjar.surveyUrl && (
              <li className="list-inline-item px-1">
                <a
                  className="small-prints font-weight-bold"
                  href={hotjar.surveyUrl}
                  style={{ color: "#0bd9d2" }}
                >
                  <Trans i18nKey="give_feedback" />
                </a>
              </li>
            )}
          </ul>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
