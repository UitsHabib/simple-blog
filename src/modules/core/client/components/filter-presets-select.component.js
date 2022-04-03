import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Select, { components } from 'react-select';

const FilterPresetsSelect = ({ filterPresets, selectedFilterPreset, onFilterPresetClick, isClearable, placeholder = 'Quick Filter' }) => {
    const location = useLocation();

    const [filterPresetOptions, setFilterPresetOptions] = useState(null);
    const [selectedFilterPresetOption, setSelectedFilterPresetOption] = useState(null);
    const [filterPresetList, setFilterPresetList] = useState([]);

    useEffect(() => {
        if (selectedFilterPreset?.title) {
            setSelectedFilterPresetOption({
                ...selectedFilterPreset,
                label: selectedFilterPreset.title,
                value: selectedFilterPreset.id
            });
        } else {
            setSelectedFilterPresetOption(null);
        }
    }, [selectedFilterPreset]);

    useEffect(() => {
        if (filterPresets && filterPresets.length) {
            const filterPresetsForSelect = filterPresets.map(f => ({
                ...f,
                label: f.title,
                value: f.id
            }));

            const ownedFilters = filterPresetsForSelect.filter(f => f.isOwnedByCurrentUser);
            const nonOwnedFilters = filterPresetsForSelect.filter(f => !f.isOwnedByCurrentUser);

            const filterOptions = [
                {
                    label: <div className="cdp-text-primary h6 fw-bold"><i className="fas fa-user me-2 cdp-text-primary"></i> My Filters</div>,
                    options: ownedFilters
                },
                {
                    label: <div className="cdp-text-primary h6 fw-bold"><i className="fas fa-globe me-2 cdp-text-primary"></i> Filters by Others</div>,
                    options: nonOwnedFilters
                }
            ];

            setFilterPresetOptions(filterOptions);
            setFilterPresetList(filterPresetsForSelect);
        }
    }, [filterPresets]);

    const FilterOptionRenderer = props => {
        const { title, isOwnedByCurrentUser, owner } = props.data;
        return (
            <components.Option {...props} className="border-top">
                <div className="form-check custom-checkbox px-0">
                    <label className="form-check-label small" for="customCheck1">{title}</label>
                    {!isOwnedByCurrentUser && <div className="text-secondary small text-break fst-italic">by {owner}</div>}
                </div>
            </components.Option>
        );
    };

    const customFilter = (option, inputValue) => {
        return option.data.title.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.data.owner.toLowerCase().includes(inputValue.toLowerCase());
    };

    const handlePresetChange = (presetId) => {
        const urlSearchParams = new URLSearchParams(location.search);

        if (!presetId) urlSearchParams.delete('filter');
        else urlSearchParams.set('filter', presetId);

        onFilterPresetClick && onFilterPresetClick({
            selectedFilterPreset: filterPresetList.find(preset => preset.id === presetId),
            url: `${location.pathname}${urlSearchParams ? `?${urlSearchParams}` : null}`
        });
    }

    const [maxMenuHeight, setmaxMenuHeight] = useState(null);
    const [menuIsOpen, setmenuIsOpen] = useState(false);
    const [isFocused, setisFocused] = useState(null);
    const [isIphoneDevice, setisIphoneDevice] = useState(false);
    useEffect(() => {
        setisIphoneDevice((navigator.userAgent.match(/iPhone/i)))
    },[])

    const onFocus=()=>{
        if (window.innerWidth<576) {
            setmaxMenuHeight(180) 
            setmenuIsOpen(true)
        }else{
            setmaxMenuHeight(500) 
        }
    }

    const onBlur=()=>{
        if (window.innerWidth<576) {
            setmenuIsOpen(false)
        }
    }
    
    useEffect(() => {
        window.addEventListener("scroll",()=>{
          const stickyPanel=document.querySelector(".cdp-table__responsive-sticky-panel")  
          if (window.innerWidth<576 && isIphoneDevice) {
              if(stickyPanel.getBoundingClientRect().top<=0 && isFocused===true){
                  setmenuIsOpen(false)
              }
          }  
        });
        return () => {
          window.removeEventListener("scroll",()=>{
              if (window.innerWidth<576 && isIphoneDevice) {
                if(stickyPanel.getBoundingClientRect().top<=0 && isFocused===true){
                    setmenuIsOpen(false)
                }
              }  
          });
        };
      });
    
    return filterPresets?.length
        ? (
            <div className="me-2 mb-2 mb-sm-0">
                <Select
                    name="filter"
                    components={{ Option: FilterOptionRenderer }}
                    hideSelectedOptions={true}
                    filterOption={customFilter}
                    options={filterPresetOptions}
                    className="multiselect desktop-select multiselect__quick-filter"
                    classNamePrefix="multiselect"
                    value={selectedFilterPresetOption}
                    onChange={selectedOption => handlePresetChange((selectedOption || {}).id)}
                    placeholder={placeholder}
                    isClearable={isClearable}
                    maxMenuHeight={maxMenuHeight}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    menuIsOpen={menuIsOpen}
                    onMenuOpen={()=>{setmenuIsOpen(true);setisFocused(true)}}   
                    onMenuClose={()=>{setmenuIsOpen(false);setisFocused(false)}}      
                />
            </div>
        )
        : null;
}

export default FilterPresetsSelect;
