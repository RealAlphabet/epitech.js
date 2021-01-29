
//////////////////////////////////////////////////
//  PAGE HOME
//////////////////////////////////////////////////


export default {

    data() {
        return {
            user:       null,
            modules:    []
        };
    },

    methods: {
        renderModule(module) {

            // Note

            let percent;
            let skills  = Object.entries(module.results.skills);
            let sum     = 0;
            let total   = 0;

            for (let [_, result] of skills) {
                sum     += result.passed;
                total   += result.count;
            }

            percent = (sum / total) * 100;
            percent = Math.round(percent * 10) / 10;


            // Date

            let date = new Date(module.date).toLocaleString();


            // Render

            return (
                <div class="module">
                    <div class="module-title">
                        {module.project.name}
                    </div>

                    <div class="module-date">
                        {date}
                    </div>

                    <div class={({
                        "module-percent": 1,
                        "success"   : percent >= 80,
                        "warning"   : percent < 80 && percent >= 50,
                        "danger"    : percent < 50
                    })}>
                        {percent} %
                    </div>
                </div>
            )
        }
    },

    render() {
        if (this.user)
            return (
                <div>
                    <div class="welcome">
                        <div>Hello {this.user.firstname},</div>
                        <div>You got <b>{this.user.credits}</b> credits and <b>{this.user.gpa[0].gpa}</b> of GPA !</div>
                    </div>

                    <div class="modules">
                        {this.modules.map(this.renderModule)}
                    </div>
                </div>
            );

        else
            return (
                <div>
                    Hello World !
                </div>
            );
    },

    created() {
        fetch(`/api/me`)
            .then(res => res.json())
            .then(({ user }) => {
                fetch(`/api/marvin`)
                    .then(res => res.json())
                    .then(modules => {
                        this.user       = user;
                        this.modules    = modules.reverse();
                    })
            });
    }
}