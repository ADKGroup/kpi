import React from "react";
import bem from "../../bem";
import ui from "../../ui";
import { t } from "../../utils";
import Select from "react-select";

let FormGalleryFilter = React.createClass({
  getInitialState(){
    return{
      availableOptions: null
    }
  },
  componentDidMount: function(){
    this.setAvailableOptions(this.props.searchFilters);
  },
  setAvailableOptions: function (options) {
    const availableOptions = options.map( item =>  {
      const searchVal = item.name || `${t("Record")} ${item.index + 1}`;
      const newOpt = {
        value: searchVal,
        label: searchVal,
      }
      return newOpt;
    });
    this.setState({
      availableOptions,
    });

  },
  render() {
    const placeholderText = `Filter by ${this.props.currentFilter.source == 'question' ? t("Question") : t("Record")}`;
    return (
      <bem.AssetGallery__heading>
        <div className="col6">
          <bem.AssetGallery__count>
            <strong>{this.props.attachments_count} {t("Images")}</strong>
          </bem.AssetGallery__count>
        </div>
        <div className="col6">
          <bem.AssetGallery__headingSearchFilter className="section">
            <Select
              ref="filterSelect"
              className="text-display"
              options={this.state.availableOptions}
              simpleValue
              placeholder={placeholderText}
              name="selected-filter"
              value={this.props.searchTerm}
              onChange={this.props.setSearchTerm}
              autoBlur={true}
              searchable={true}
            />
            <ui.PopoverMenu type='blur'
              triggerLabel={<i className={`k-icon-settings`}/>}>
              {this.props.groupByValues.map((item, index) =>{
                return (
                  <bem.PopoverMenu__link
                    key={'groupByValue-' + index}
                    onClick={() => this.props.switchFilter(item.value)}>
                    {item.label}&nbsp;
                  </bem.PopoverMenu__link>
                );
              })}
            </ui.PopoverMenu>
          </bem.AssetGallery__headingSearchFilter>

        </div>
      </bem.AssetGallery__heading>
    );
  }
});

module.exports = FormGalleryFilter;
