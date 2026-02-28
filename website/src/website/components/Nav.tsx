import * as React from "react";
import { home, playground, docs, monarch } from "../pages/routes";
import { Container, Navbar, Nav, NavDropdown } from "./bootstrap";

export class PageNav extends React.Component {
	render() {
		return (
			<Navbar bg="dark" variant="dark" expand="lg">
				<Container fluid>
					<Navbar.Brand href="./">
						<span className="code-oss-icon d-inline-block align-top" />
						Monaco Editor
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" role="">
						<Nav className="me-auto">
							<Nav.Link active={home.isActive} href={home.href}>
								Home
							</Nav.Link>
							<Nav.Link
								active={playground.isActive}
								href={playground.href}
							>
								Playground
							</Nav.Link>
							<Nav.Link
								active={monarch.isActive}
								href={monarch.href}
							>
								Monarch
							</Nav.Link>
							<Nav.Link active={docs.isActive} href={docs.href}>
								Documentation
							</Nav.Link>
						</Nav>

						<Nav className="ms-auto">
							<NavDropdown
								title={
									<>
										<span className="nav-icon bi-download" />
										<span className="hidden-text">
											{" "}
											Download{" "}
										</span>
									</>
								}
								className="download-dropdown"
								align="end"
							>
								{/*<NavDropdown.Item href="#action/3.1">
									Download 0.33.0
							</NavDropdown.Item>*/}
								<NavDropdown.Item
									href="https://www.npmjs.com/package/monaco-editor"
									target="_blank"
								>
									Get From NPM
								</NavDropdown.Item>
							</NavDropdown>

							<Nav.Link
								href="https://github.com/microsoft/monaco-editor"
								target="_blank"
							>
								<span className="nav-icon bi-github" />
								<span className="hidden-text"> GitHub </span>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}
