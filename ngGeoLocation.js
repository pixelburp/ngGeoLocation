(function(window, angular) {
  'use strict';

  var ngGeoLocation = angular.module('ngGeoLocation', []),
      getCountry = function(results) {
        var i = 0,
            length = results[0].address_components.length;

        for(i; i < length; i+=1) {
          var shortName = results[0].address_components[i].short_name,
              longName = results[0].address_components[i].long_name,
              type = results[0].address_components[i].types;

          if(type.indexOf('country') !== -1) {
            return shortName ? shortName : longName;
          }
        }
      };

  ngGeoLocation.service('geoLocation', function ($rootScope) {
    return {
      countryCode: '',

      init: function() {
        if(!navigator.geolocation || !google || !google.maps) {
          return false;
        }
        this.getPosition();
      },

      isUkLocation: function() {
        return this.countryCode === 'GB';
      },

      getPosition: function() {
        var self = this,
            geocoder = new google.maps.Geocoder(),
            coords;

        navigator.geolocation.getCurrentPosition(function(position) {
          coords = new google.maps.LatLng(
            position.coords.latitude, position.coords.longitude
          );

          geocoder.geocode({ latLng: coords }, function(results, status) {
            if(status === google.maps.GeocoderStatus.OK) {
              if(results[0]) {
                $rootScope.$apply(function() {
                  self.countryCode = getCountry(results);
                });
              }
            }
          });        
        });
      }

    };
  });

})(window, window.angular);
