var ContributionApp = new Backbone.App();

var Step = Backbone.Model({
    defaults:
    {
        number: 1,
        name: "Test step",
        description: "Some html",
        hints: [],
        isCompleted: false
    }
});

var Steps = Backbone.Collection({
    model: Step,
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

ContributionApp.init(function(){
    var steps = [
        {   number: 1,
            name: "Choose a project"
        },
        {
            number: 2,
            name: "Learn about the community"
        }
    ];

    var Steps;

    _.each(steps, function(stepData){
        var step = Step(stepData);
        // default pre-processing
        step.slug = step.name.strip(' ');
        Steps.add(step);
    });

    Steps.setActiveStep(Steps[0]);
});


var stepTemplate =
    '<li id="step-{{step.number}}" class="step {{#if step.isCompleted }}step-completed{{#endif }}">
        <a name="#{{step.slug}}"></a>
        <div class="step-header"><span class="step-number">{{ step.number}}.)</span> {{ step.name }}</div>
        <div class="step-body">
            <div class="step-description">{{ step.description }}</div>
            {{#each hints }}
            <div class="step-hint">{{ hint }}</div>
            {{#endeach }}
        </div>
    </li>';
