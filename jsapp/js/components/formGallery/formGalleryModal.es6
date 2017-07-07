import React from "react";
import Modal from "react-modal";
import bem from "../../bem";
import ui from "../../ui";
import {dataInterface} from '../../dataInterface';
import Slider from "react-slick";
import { t } from "../../utils";

let FormGalleryModal = React.createClass({
  componentDidUpdate: function() {
    if (this.refs.slider) {
      this.refs.slider.slickGoTo(this.props.galleryItemIndex);
    }
  },
  handleCarouselChange(currentIndex, newIndex) {
    this.props.changeActiveGalleryIndex(newIndex);
  },

  render() {
    const settings = {
      dots: false,
      fade: true,
      lazyLoad: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slide: "slide",
      slidesToScroll: 1,
      initialSlide: this.props.galleryItemIndex,
      nextArrow: <RightNavButton />,
      prevArrow: <LeftNavButton />
    };

    return (
      <Modal isOpen={true} contentLabel="Modal">
        <bem.AssetGallery__modal>
          <ui.Modal.Body>

            <bem.AssetGallery__modalCarousel className="col8">
              <Slider
                ref="slider"
                {...settings}
                beforeChange={this.handleCarouselChange}
              >
                {this.props.activeGalleryAttachments.map(
                  function(item, i) {
                    return (
                      <div key={i}>
                        <img
                          alt={this.props.galleryTitle}
                          src={item.large_download_url}
                        />
                      </div>
                    );
                  }.bind(this)
                )}
              </Slider>
            </bem.AssetGallery__modalCarousel>

            <FormGalleryModalSidebar
              activeGalleryAttachments={this.props.activeGalleryAttachments}
              filter={this.props.filter}
              galleryItemIndex={this.props.galleryItemIndex}
              galleryTitle={this.props.galleryTitle}
              galleryIndex={this.props.activeGallery.index}
              date={this.props.galleryDate}
              changeActiveGalleryIndex={this.props.changeActiveGalleryIndex}
              closeModal={this.props.closeModal}
              setSearchTerm={this.props.setSearchTerm}
              uid={this.props.uid}
            />

          </ui.Modal.Body>
        </bem.AssetGallery__modal>
      </Modal>
    );
  }
});

let FormGalleryModalSidebar = React.createClass({
  getInitialState: function() {
    return {
      featuredRecord: null,
      recordIndex:  this.props.filter === "question" ? this.props.galleryItemIndex + 1 : this.props.galleryIndex + 1
    }
  },
  componentDidMount: function() {
    console.log(this.props.uid);
    this.getRecordByIndex();
  },
  getRecordByIndex: function () {
    dataInterface
      .loadMoreRecords (this.props.uid, 'submission', this.state.recordIndex, 1)
      .done(response => {
        response.loaded = true;
        console.log(response);
        this.setState({
          featuredRecord: response.results[0].attachments.results
        });
      });
  },
  goToFilter: function(gridLabel, newFilterValue) {
    this.props.closeModal();
    this.props.setSearchTerm(gridLabel, newFilterValue);
  },
  render() {
    let featuredItems = this.props.activeGalleryAttachments.slice();
    featuredItems.splice(this.props.galleryItemIndex, 1);
    if(this.state.featuredRecord !== null && Object.keys(this.state.featuredRecord).length){
      console.log(this.state.featuredRecord);
    }
    const recordLabel = t("Record") +" #"+this.state.recordIndex;
    return (
      <bem.AssetGallery__modalSidebar className="col4 open">
        <i className="toggle-info k-icon-close" onClick={this.props.closeModal} />
        <bem.AssetGallery__modalSidebarInfo>
            <p>{recordLabel}</p>
            <h3>{this.props.galleryTitle}</h3>
            <p>{this.props.date}</p>
        </bem.AssetGallery__modalSidebarInfo>

          <bem.AssetGallery__modalSidebarGridWrap>
            {this.props.activeGalleryAttachments != undefined && 
              <bem.AssetGallery__modalSidebarGridWrap__row>
                <h5 onClick={() => this.goToFilter(this.props.galleryTitle, 'question')}>
                  {t("More for") + " " + this.props.galleryTitle}
                </h5>
                <bem.AssetGallery__modalSidebarGrid>
                  {featuredItems.filter((j, index) => index < 6).map(
                    function(item, j) {
                      var divStyle = {
                        backgroundImage: "url(" +
                          item.medium_download_url +
                          ")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover"
                      };
                      return (
                        <bem.AssetGallery__modalSidebarGridItem
                          key={j}
                          className="col6"
                          // onClick={() => this.props.changeActiveGalleryIndex(j)}
                        >
                          <div className="one-one" style={divStyle} />
                        </bem.AssetGallery__modalSidebarGridItem>
                      );
                    }.bind(this)
                  )}
                </bem.AssetGallery__modalSidebarGrid>
              </bem.AssetGallery__modalSidebarGridWrap__row>
            }

            {this.state.featuredRecord !== null &&
              <bem.AssetGallery__modalSidebarGridWrap__row>
                <h5 onClick={() => this.goToFilter(recordLabel.replace("#", ""), 'submission')}>
                  {t("More for")} {recordLabel}
                </h5>
                <bem.AssetGallery__modalSidebarGrid>
                  {this.state.featuredRecord.filter((j, index) => index < 6 ).map(
                    function(item, j) {
                      var divStyle = {
                        backgroundImage: "url(" +
                          item.medium_download_url +
                          ")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover"
                      };
                      return (
                        <bem.AssetGallery__modalSidebarGridItem
                          key={j}
                          className="col6"
                          // onClick={() => this.props.changeActiveGalleryIndex(j)}
                        >
                          <div className="one-one" style={divStyle} />
                        </bem.AssetGallery__modalSidebarGridItem>
                      );
                    }.bind(this)
                  )}
                </bem.AssetGallery__modalSidebarGrid>
              </bem.AssetGallery__modalSidebarGridWrap__row>
            }
          </bem.AssetGallery__modalSidebarGridWrap>

        
      </bem.AssetGallery__modalSidebar>
    );
  }
});

//Slider Navigation
let RightNavButton = React.createClass({
  render() {
    const { className, onClick } = this.props;
    return (
      <button onClick={onClick} className={className}>
        <i className="k-icon-next" />
      </button>
    );
  }
});

let LeftNavButton = React.createClass({
  render() {
    const { className, onClick } = this.props;
    return (
      <button onClick={onClick} className={className}>
        <i className="k-icon-prev" />
      </button>
    );
  }
});

module.exports = FormGalleryModal;
