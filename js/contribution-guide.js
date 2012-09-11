var data = {
    objects: [
        {
        number: 1,
        name: "Pick a project",
        description:  "<p>How do you choose an open source project to contribute to?</p><p>Think of it this way: You're looking for a project whose <em>goal</em> and <em>community</em> would make for an engaging hobby. (Even if you only contribute to the project once, it should still be something you enjoy doing.)</p><p>There is one exception: If you have to work on this project, for some reason such as your job.</p><p>Think about the following things:</p><ul><li>Does the software behind the project solve a problem you want to help solve?</li><li>Is there something you admire about the project?</li><li>Does the project have good ways for you to contribute? For example, maybe it needs documentation, or maybe it is written in a programming language you want to learn or already know.</li></ul>"
        },
        {
        number: 2,
        name: "Use the software",
        description: "<p>Before you contribute to an open source project, you're going to want to be familiar with how the program works and what people use it for. Legend has it that the best projects to contribute to are ones you already use. What matters most is that you can understand what kinds of changes would benefit users of the program, and that comes from experience using it.</p>"
        },
        {
        number: 3,
        name: "Find the (tech) community",
        description: "<p>Many open source projects have one set of information for users of the project, and another set of information for prospective contributors. It's essential that you find the contributor-oriented venues so you can be plugged-in to conversation about the project.</p><p>Look for these kinds of things:</p><ul><li>IRC channel, for chatting</li><li>A developer-oriented email list</li><li>A bug tracker</li></ul><p>The documentation for some open source projects is very scattered, so your best bet for finding (for example) the WordPress email list is to just search the web with Google. Try searching for [wordpress email list].</p><p>Note that if a project does not use tools like this, that can be a warning sign that they are not good at handling contributions.</p><p>This step is essential, so raise your hand when you finish, and a staff member will come by, validate your findings, and give you a high-five.</p>",
        expected_time: 10
        },
        {
        number: 4,
        name: "Choose what you'll improve",
        description: "<p>For this step, you can come up with your own idea, or find a task suggested by the project.</p><p>We <em>strongly recommend</em> choosing a task that is very well-defined! Fixing a typo in the documentation, adding some comments to the project's source code, or fixing a small bug with a very clear solution are all good options.</p><p>Many projects list bugs that are \"easy\", or good for first time contributors. A future version of this document will link to good first bugs.</p><p>If you have come up with your own idea of what to work on, make sure to enter it into the bug tracker for the project.</p><p>Once you have your idea of what you'll work on, raise your hand, and a staff member will come by and make sure they agree it will fit in the limited time we have today. Then you will get a high five!</p>"
        }
    ]
};


ContributionHowto = new Backbone.Marionette.Application();

ContributionHowto.addRegions({
    guideRegion: "#guide"
});

Step = Backbone.Model.extend({
    defaults: {
        number: 1,
        name: "Test step",
        description: "Some html",
        hints: [],
        isCompleted: false
        }
});

Steps = Backbone.Collection.extend({
    model: Step,
    comparator: function(entry){
        return entry.get('number');
        },   
    activeStep: '',
    goForward: function(){
        changeStep(true);
    },
    goBackward: function(currentStep){
        changeStep(false);
    },
    changeStep: function(goForward){
        var newStep, stepDirection;
        var currentStep = this.activeStep;
        currentStep.isCompleted = goForward;
        if (goForward){
            stepDirection = 1;
        } else {
            stepDirection = -1;
        }
        newStep = steps[currentStep.number + stepDirection];
        setActiveStep(newStep);
    },
    setActiveStep: function(step){
        if (this.activeStep){
            $(this.activeStep).removeClass('active-step');
        }
        this.activeStep = step;
        $(this.activeStep).addClass('active-step');
        // something with the router
    }
});

StepView = Backbone.Marionette.ItemView.extend({
    template: '#step-template',
    className: 'step',
    tagName: 'li',
    initialize: function() { 
        this.render(); 
        },
    render: function() {
        // Compile the template using Handlebars
        var stepData = this.model.toJSON();
        var template = Handlebars.compile( $(this.template).html() );
        // Load the compiled HTML into the Backbone "el"
        console.log(stepData);
        $(this.el).html( template(stepData) );
        }
    
});

StepsView = Backbone.Marionette.CompositeView.extend({
    tagName: "div",
    id: 'steps',
    className: '',
    template: '#guide-template',
    itemView: StepView,
    
    initialize: function() { 
        this.render(); 
        },
    render: function() {
        var stepsData = this.collection.toJSON();
        console.log(stepsData);
        // Compile the template using Handlebars
        var template = Handlebars.compile($('#guide-template').html());
        console.log(template(stepsData));
        $('#steps-list').append($(this.el).html(template(stepsData)));
        },
    });
    
ContributionHowto.addInitializer(function(options){
    var stepsView = new StepsView({
        collection: options.steps
    });
    ContributionHowto.guideRegion.show(stepsView);
    });
    
$(document).ready(function(){
    var steps = new Steps([]);
    
    _.each(data.objects, function(step){
        var s = new Step(step)
        s.slug = step.name.replace(' ','_');
        steps.add(s);
        });
        
    steps.setActiveStep(Steps[0]);
    
    ContributionHowto.start({ steps: steps });
    
    });
