import React, { useState, useCallback } from 'react'
import classnames from 'classnames';
import { ButtonGroup, Button } from 'shards-react'

const dateOptions = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '1Y', value: 12 },
    { label: '2Y', value: 24 },
    { label: '5Y', value: 60 },
]
const DashboardDateBar = ({ onRangeChange }) => {
    const [activeOption, setActiveOption] = useState(1);
    const handleClick = useCallback((value, i) => {
        onRangeChange(value)
        setActiveOption(i)
    }, [])
    
    return (
        <>
        <div className="d-flex align-items-center px-2">
             Date Range
        </div>
        <ButtonGroup>
            {dateOptions.map(({ label, value }, i) =>
             <Button 
                className={classnames('btn', i == activeOption ? 'btn-primary' : 'btn-white')} 
                key={value}
                onClick={() => handleClick(value, i)}>
                    {label}
            </Button>)}
          
          </ButtonGroup>
        </>
    )
}

export default DashboardDateBar;
