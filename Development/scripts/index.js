$(document).ready(function() {
    $("#form").submit(function(event){
        event.preventDefault()

        let form = $(this),
            user = $("#user-name").val()

        $.get('/player/' + user, appendSkills)
            .success((success) => form.trigger('reset'))
            .fail((error) => console.log('Not sure what happened exactly, but here\s the error report: ', error))
    })

    function appendSkills(data, username) {
        let user = $("#user-name").val()

        console.groupCollapsed(user) // To organize our console logs

        data.map( (index) => console.log(JSON.stringify(index)) )

        let skills_list = new Array()
        let total_combt = new Array()

        let skills  = data.filter( (index) => index.skill !== 'overall' )
        let overall = data.filter( (index) => index.skill  == 'overall' )

        skills.map(function(index) {
            let skill      = index.skill,
                rank       = index.rank,
                level      = index.level,
                experience = index.experience

            let skillElement = `<div class="skill ${skill}"><div class="skill-image" data-skill="${skill}"></div><div class="skill-level">${level}</div></div>`

            skills_list.push(skillElement)
        })


        total_combt.push(overall[0].skill + ": " + overall[0].level)

        $('.skills, .overall-and-combat').empty()
        $('.overall-and-combat').append(total_combt)
        $('.skills').append(skills_list)
        console.groupEnd()
    }
})