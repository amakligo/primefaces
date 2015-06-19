/**
 * PrimeFaces Carousel Widget
 */
PrimeFaces.widget.Carousel = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.viewport = this.jq.children('.ui-carousel-viewport'); 
        this.itemsContainer = this.viewport.children('.ui-carousel-items');
        this.items = this.itemsContainer.children('li');
        this.itemsCount = this.items.length;
        this.header = this.jq.children('.ui-carousel-header');
        this.prevNav = this.header.children('.ui-carousel-prev-button');
        this.nextNav = this.header.children('.ui-carousel-next-button');
        this.pageLinks = this.header.find('> .ui-carousel-page-links > .ui-carousel-page-link');
        this.dropdown = this.header.children('.ui-carousel-dropdown');
        
        this.cfg.numVisible = this.cfg.numVisible||3;
        this.cfg.firstVisible = this.cfg.firstVisible||0;
        this.cfg.effectDuration = this.cfg.effectDuration||500;
        this.page = this.cfg.firstVisible / this.cfg.numVisible;
        this.totalPages = Math.ceil(this.itemsCount / this.cfg.numVisible);
        
        this.updateNavigators();
        this.initDimensions();
        this.bindEvents();
    },
    
    initDimensions: function() {
        var firstItem = this.items.eq(0);
        if(firstItem.length) {
            var itemFrameWidth = firstItem.outerWidth(true) - firstItem.width();    //sum of margin, border and padding
            this.items.width(this.viewport.innerWidth()/this.cfg.numVisible - itemFrameWidth);
        }
        
        if(this.cfg.firstVisible === 0) {
            this.itemsContainer.css('left',0);
            this.prevNav.addClass('ui-state-disabled');
        }
    },
    
    bindEvents: function() {
        var $this = this;
        
        this.prevNav.on('click', function() {
            if($this.page !== 0) {
                var currentLeft = parseFloat($this.itemsContainer.css('left'));
                
                $this.itemsContainer.animate({
                    left: currentLeft + $this.viewport.innerWidth()
                    ,easing: $this.cfg.easing
                }, $this.cfg.effectDuration, function() {
                    $this.page--;
                    $this.updateNavigators();
                });
            }
        });
        
        this.nextNav.on('click', function() {
            if($this.page !== ($this.totalPages - 1)) {
                var currentLeft = parseFloat($this.itemsContainer.css('left'));
                
                $this.itemsContainer.animate({
                    left: currentLeft - $this.viewport.innerWidth()
                    ,easing: $this.cfg.easing
                }, $this.cfg.effectDuration, function() {
                    $this.page++;
                    $this.updateNavigators();
                });
            }
        });
        
        if(this.pageLinks.length) {
            this.pageLinks.on('click', function(e) {
                $this.setPage($(this).index());
                e.preventDefault();
            });
        }
        
        if(this.dropdown.length) {
            this.dropdown.on('change', function() {
                $this.setPage(parseInt($(this).val()) - 1);
            });
        }
    },
    
    updateNavigators: function() {
        if(this.page === 0) {
            this.prevNav.addClass('ui-state-disabled');
            this.nextNav.removeClass('ui-state-disabled');   
        }
        else if(this.page === (this.totalPages - 1)) {
            this.prevNav.removeClass('ui-state-disabled');
            this.nextNav.addClass('ui-state-disabled');
        }
        else {
            this.prevNav.removeClass('ui-state-disabled');
            this.nextNav.removeClass('ui-state-disabled');   
        }
        
        if(this.pageLinks.length) {
            this.pageLinks.filter('.ui-icon-radio-on').removeClass('ui-icon-radio-on');
            this.pageLinks.eq(this.page).addClass('ui-icon-radio-on');
        }
    },
    
    setPage: function(p) {                
        if(p !== this.page) {
            var $this = this;
            
            this.itemsContainer.animate({
                left: -1 * (this.viewport.innerWidth() * p)
                ,easing: this.cfg.easing
            }, this.cfg.effectDuration, function() {
                $this.page = p;
                $this.updateNavigators();
            });
        }
    }
});   