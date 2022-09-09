BRANDNAME = 'RealtorPMS'
SUPPORT_MAIL = "info@#{BRANDNAME.downcase}.com"
DOMAIN_DEV = "lvh.me"
DOMAIN_STAGING = "dev.#{BRANDNAME.downcase}.com"
DOMAIN_PRODUCTION = "#{BRANDNAME.downcase}.com"
COLOR_PALETTE = %w(#14281D #E34A6F #875053 #84828F #E09F7D #404E5C #7E6B8F #E3B23C #DA3E52 #E49273 #031D44 #04395E #70A288 #DAB785 #D5896F)

SPITOGATOS_WEBSERVICE_URL = 'http://webservices.spitogatos.gr/listingSync/v1_0'
SPITOGATOS_APP_KEY = 'bjknIW88SMhjWyb0pddvHXAdl'
SPITOGATOS_DUMMY_DATA = {
  location: {
    geographyId: 3011
  },
  propertyDetails: {
    category: 'residential',
    propertyType: 'apartment',
    livingArea: 60,
    rooms: 1
  },
  detailedCharacteristics: {
    floorNumber: 1,
    energyClass: 'bp'
  },
  listingDetails: {
    listingType: 'for sale',
    price: 125000,
    published: 'no',
    currency: 'eur'
  }
}