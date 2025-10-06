import { Button, Card, CardBody, CardImg, CardText, CardTitle, Nav, NavItem, NavLink } from "react-bootstrap";

export default function BootstrapNavigation() {
    return (
        <div id="wd-css-navigating-with-tabs">
            <h2>Tabs</h2>
            <Nav variant="tabs">
                <NavItem>
                <NavLink href="#/Labs/Lab2/Active">Active</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="#/Labs/Lab2/Link1">Link 1</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="#/Labs/Lab2/Link2">Link 2</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="#/Labs/Lab2/Disabled" disabled>Disabled</NavLink>
                </NavItem>
            </Nav>

            <div id="wd-css-navigating-with-cards">
            <h2> Cards </h2>
                <Card style={{ width: "18rem" }}>
                    <CardImg variant="top" src="../../images/stacked.jpg" />
                    <CardBody>
                    <CardTitle>Lake View</CardTitle>
                    <CardText>
                        The lake view in the evening. Fall Season and its Beauty! 
                    </CardText>
                    <Button variant="primary">Scenic Beauty</Button>
                </CardBody>
                </Card>
            </div>

        </div>


    );
}