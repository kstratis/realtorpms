require 'pagy/extras/bootstrap'

Pagy::DEFAULT[:items] = 12

Pagy::I18n.load({ locale: 'el', filepath: 'config/locales/pagy/el.yml' },
                { locale: 'en' })
