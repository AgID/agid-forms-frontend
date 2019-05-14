import * as React from "react";
import { Col, Collapse, Container, Row } from "reactstrap";

import Icon from "./Icon";

type SlimHeaderProps = {
  owners: ReadonlyArray<{
    name: string;
    url: string;
  }>;
  slimHeaderLinks: ReadonlyArray<
    ReadonlyArray<{
      name: string;
      url: string;
    }>
  >;
};

type SlimHeaderState = {
  isOpen: boolean;
};

type Owner = {
  name: string;
  url: string;
};

const OwnerComponent = (institutionalOwner: Owner) => (
  <a
    className="navbar-brand mr-1 mr-lg-3"
    key={institutionalOwner.name}
    href={institutionalOwner.url}
  >
    {institutionalOwner.name}
  </a>
);

class SlimHeader extends React.Component<SlimHeaderProps, SlimHeaderState> {
  public state = {
    isOpen: false
  };

  public toggle() {
    this.setState(prevState => {
      return {
        isOpen: !prevState.isOpen
      };
    });
  }

  public render() {
    return (
      <div className="it-header-slim-wrapper">
        <Container>
          <Row>
            <Col xs="12">
              <div className="it-header-slim-wrapper-content">
                <div className="d-none d-lg-block">
                  {this.props.owners.map(OwnerComponent)}
                  {/*
                    .reduce((prev, curr, index) => [
                      prev,
                      <span
                        key={index}
                        className="navbar-brand text-white mr-1 mr-lg-3"
                      >
                        +
                      </span>,
                      curr
                    ])}
                    */}
                </div>
                <span className="nav-mobile col-12 col-lg-auto">
                  <nav aria-label="navigazione network">
                    <div className="d-flex">
                      <div className="d-lg-none">
                        {this.props.owners.map(OwnerComponent)}
                        {/*
                          .reduce((prev, curr, index) => [
                            prev,
                            <span
                              key={index}
                              className="navbar-brand text-white mr-1 mr-lg-3"
                            >
                              +
                            </span>,
                            curr
                          ])}
                        */}
                      </div>
                      <a
                        className="it-opener d-lg-none p-1 ml-auto"
                        role="button"
                        aria-label="Espandi link slim header"
                        aria-expanded={this.state.isOpen}
                        aria-controls="slimHeaderLinks"
                        onClick={() => this.toggle()}
                      >
                        <Icon icon="expand" />
                      </a>
                    </div>
                    <Collapse
                      isOpen={this.state.isOpen}
                      className="link-list-wrapper"
                      id="slimHeaderLinks"
                    >
                      <ul className="link-list border-0">
                        {this.props.slimHeaderLinks.map(
                          (slimHeaderLinkGroup, groupIndex) =>
                            slimHeaderLinkGroup.map(
                              (slimHeaderLinkItem, itemIndex) => (
                                <li
                                  key={[groupIndex, itemIndex].join("-")}
                                  className={
                                    itemIndex + 1 ===
                                      slimHeaderLinkGroup.length &&
                                    groupIndex + 1 !==
                                      this.props.slimHeaderLinks.length
                                      ? "border-lg-right border-bottom border-lg-bottom-0"
                                      : ""
                                  }
                                >
                                  <a
                                    href={slimHeaderLinkItem.url}
                                    className="px-0 px-lg-3"
                                  >
                                    {slimHeaderLinkItem.name}
                                  </a>
                                </li>
                              )
                            )
                        )}
                      </ul>
                    </Collapse>
                  </nav>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SlimHeader;
