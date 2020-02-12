import React from 'react'
import { Row, Col } from 'shards-react' 

const PortfolioStatistics = () => {
    return(
        <Row>
            <Col lg="11" className="mx-auto">
                <Row className="portfolio-stats">
                    <Col className="portfolio-stats_item" style={{paddingTop:25}}>
                        <b>Portfolio Statistics</b>
                    </Col>
                    <Col className="portfolio-stats_item text-center">
                        <h6>Average EUI</h6>
                        <h3 className="portfolio-stats_item_value">88</h3>
                    </Col>
                    <Col className="portfolio-stats_item text-center">
                        <h6>Total Active Alarms</h6>
                        <h3 className="portfolio-stats_item_value">26</h3>
                    </Col>
                    <Col className="portfolio-stats_item text-center">
                        <h6>Average Consumption</h6>
                        <h3 className="portfolio-stats_item_value green">-5.4%</h3>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default PortfolioStatistics;