import { Link } from "gatsby";
import * as React from "react";
import { Container } from "reactstrap";

export interface IBreadcrumbItem {
  label: string;
  link: string;
}

const Breadcrumb = ({ items }: { items: ReadonlyArray<IBreadcrumbItem> }) => (
  <div className="d-none d-md-flex align-items-center neutral-1-bg-a1 py-md-4 pl-5 breadcrumb-container">
    <Container>
      <nav className="d-flex align-items-center" aria-label="breadcrumb">
        <ol className="breadcrumb m-0">
          {items.slice(0, -1).map(item => (
            <li className="breadcrumb-item" key={item.link}>
              <Link
                className="font-weight-bold text-decoration-none"
                to={item.link}
              >
                {item.label}
              </Link>
              <span className="separator">/</span>
            </li>
          ))}
          {items.length > 1 &&
            items.slice(-1).map(item => (
              <li className="breadcrumb-item active" key={item.link}>
                <span className="text-decoration-none">
                  {item.label}
                </span>
              </li>
            ))}
          {items.length <= 1 &&
            items.slice(-1).map(item => (
              <li className="breadcrumb-item" key={item.link}>
                <Link
                  to={item.link}
                  className="font-weight-bold text-decoration-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ol>
      </nav>
    </Container>
  </div>
);

export default Breadcrumb;
