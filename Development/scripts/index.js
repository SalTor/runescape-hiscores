$(document).ready(function() {
    $("#form").submit(function(event){
        event.preventDefault();

        let user = $("#user-name").val();

        $.get('/player/' + user, appendSkills)
            .success(function(){})
            .fail(function(error){
                console.log('Not sure what happened exactly, but here\s the error report: ', error);
            });
    });

    function appendSkills(data, username) {
        let user = $("#user-name").val();
        console.groupCollapsed(user); // To organize our console logs
        console.time();
        console.log("data", data);

        let skills_list = [];
        let total_combt = [];

        let skills  = data.filter(function(index) {
            return index.skill !== 'overall';
        });
        for(let skill in skills){
            skills_list.push('<div class="skill ' + skills[skill].skill + '"><div class="skill-image" data-skill="' + skills[skill].skill + '"></div><div class="skill-level">' + skills[skill].level + '</div></div>');
        }

        let overall = data.filter(function(index) {
            return index.skill  == 'overall';
        });
        total_combt.push(overall[0].skill + ": " + overall[0].level);

        $('.skills, .overall-and-combat').empty();
        $('.overall-and-combat').append(total_combt);
        $('.skills').append(skills_list);

        console.timeEnd();
        console.groupEnd();
    }
});