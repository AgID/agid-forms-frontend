import { Link } from "gatsby";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as AgidLogo from "../images/logo-agid.svg";
import Icon from "./Icon";

type FooterProps = {
  footerLinks: ReadonlyArray<{ name: string; url: string }>;
  id?: string;
  socialLinks: ReadonlyArray<{ name: string; url: string; icon: string }>;
};

const Footer = ({ footerLinks, socialLinks }: FooterProps) => (
  <footer className="neutral-1-bg-a9">
    <Container>
      <Row className="py-4">
        <Col xs="12" sm="6" md="4">
          <div className="px-2 py-3">
            <a href="https://www.agid.gov.it/" target="_blank">
              <img
                src={AgidLogo}
                alt="Agenzia per l'Italia Digitale"
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
          <span>Seguici su</span>
          {socialLinks.map(socialLink => {
            return (
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
            );
          })}
        </Col>
      </Row>
      <Row className="py-4 border-white border-top">
        <ul className="col list-inline small">
          {footerLinks.map((footerLink, itemIndex) => (
            <li key={itemIndex} className="list-inline-item px-1">
              <Link
                className="small-prints font-weight-bold"
                style={{ color: "#0bd9d2" }}
                to={footerLink.url}
              >
                {footerLink.name}
              </Link>
            </li>
          ))}
        </ul>
      </Row>
    </Container>
  </footer>
);

export default Footer;
