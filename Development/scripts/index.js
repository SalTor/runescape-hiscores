$(document).ready(function() {
    $("#form").submit(function(event){
        event.preventDefault();

        let form = $(this);
        // let user = form.serialize();
        let user = $("#user-name").val();

        $.get('/player/' + user, appendSkills)
            .success(function(){
                form.trigger('reset');
            })
            .fail(function(error){
                console.log('Not sure what happened exactly, but here\s the error report: ', error);
            });
    });

    function appendSkills(data, username) {
        let user = $("#user-name").val();

        console.groupCollapsed(user); // To organize our console logs
        console.log("data", data);

        let skills_list = [];
        let total_combt = [];

        let skills  = data.filter(function(index) {
            return index.skill !== 'overall';
        });

        let getinfo = function (skill){
            return {skill: skill.skill, level: skill.level, experience: skill.experience};
        }

        for(let index in skills){
            let {skill, level} = getinfo(skills[index]);

            let skillElement = `<div class="skill ${skill}"><div class="skill-image" data-skill="${skill}"></div><div class="skill-level">${level}</div></div>`;

            skills_list.push(skillElement);
        }

        let overall = data.filter(function(index) {
            return index.skill  == 'overall';
        });

        total_combt.push(overall[0].skill + ": " + overall[0].level);

        $('.skills, .overall-and-combat').empty();
        $('.overall-and-combat').append(total_combt);
        $('.skills').append(skills_list);
        console.groupEnd();
    }
});