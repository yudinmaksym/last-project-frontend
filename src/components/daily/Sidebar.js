import React from 'react';
import {connect} from 'react-redux';
import EnergyUsagePerMdb from '../metrics/EnergyUsagePerMdb';

import {
    getWholeBuildingEnergy,
    getSelectedProject,
    getHeatMap,
} from '../../../redux/reducers/temporaryDaily';
import {
    formatInfluxData
} from '../../utils/format'
import HeatMapChart from '../metrics/HeatMapChart'


class Sidebar extends React.Component {

    formatUsePerMDB = () => {
        const {wholeBuilding, selectedProject} = this.props;

        var filtered = formatInfluxData(wholeBuilding)

        if(selectedProject.project === "IndexTower_1703") {
           return this.formatLargestPieValues(filtered)
        } else {
            let finalData = [];
            filtered.forEach((el) => {
                const splited = el.split(',');
                if(splited[3] !== undefined) {
                    finalData.push({name: splited[3], y: +(Number(splited[4]).toFixed(2))});
                }
            })
            return finalData
        }
        
    }

    formatLargestPieValues = (array) => {
        let sorted = []
        let finalData = []
        let other = 0

        array.forEach((el) => {
            const splited = el.split(',');
            if(splited[3] !== undefined) {
                sorted.push({name: splited[3], y: Number(splited[4])});
            }
        })

        sorted.sort((a,b) => b.y - a.y)
        sorted.map((el,index) => {
            if(index >= 5) {
                other += el.y
            } else {
                finalData.push(el)
            }
        })

        finalData.push({
            name: "Other",
            y: other
        })

        return finalData
    }

    render() {
        const {
            wholeBuilding,
            heatmap,
        } = this.props

        return (
            <div>
                {wholeBuilding && wholeBuilding.length !== 0 && <EnergyUsagePerMdb data={this.formatUsePerMDB()} />}
                <div className="mt-3">{heatmap.forecast && heatmap.forecast.items && heatmap.consumption && <HeatMapChart 
                    forecast={heatmap.forecast}
                    energyConsumption={heatmap.consumption}
                    tenantBaseline={heatmap.tenant}
                    title={"PROJECT FORECAST ACCURACY"}
                    />
                }</div>
            </div>   
        )
    }
}

export default connect(
    (state) => ({
        wholeBuilding: getWholeBuildingEnergy(state),
        selectedProject: getSelectedProject(state),
        heatmap: getHeatMap(state),
    }),
    (dispatch) => ({
    })
)(Sidebar);