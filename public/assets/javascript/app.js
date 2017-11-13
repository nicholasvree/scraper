

//JS for scraping internet
$("#scrape-btn").on("click", function(){
    $.get("/scrape", function(data){
        if(data){
          location.href ="/"
        }
    })
})

//JS for showing article comments
$(".comment-btn").on("click", function(){ 
  console.log("clicked")

  var id = $(this).attr("data-id")

  $("#save-btn").attr("data-id", id)

  $.get("/api/articles/" + id, function(data){

        var notes = data.note
        var modalBody = $(".modal-body")

        $('#table-body').html('');

        notes.forEach(function (element){
            $('#table-body').append(
                `<tr>
                    <td>${element.comment}</td>
                    <td>
                        <button class="delete-btn" data-article-id = ${id} data-note-id=${element._id} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </td>
                </tr>`

            )
        })
        
        console.log(notes)
        $('#myModal').modal("show")

    })
})

//JS for saving a JS comment
$("#save-btn").on("click", function(){



  var id = $(this).attr("data-id")
  var newComment = $("#new-comment").val()

  console.log(newComment)

  $.post("/api/articles/"+id, {comment: newComment})
    .done(function(data){
        console.log(data)
        $("#new-comment").val("")
        $.get("/api/articles/" + id, function(data){

        var notes = data.note
        var modalBody = $(".modal-body")

        $('#table-body').html('');

        notes.forEach(function (element){
            $('#table-body').append(
                `<tr>
                    <td>${element.comment}</td>
                    <td>
                        <button class="delete-btn" data-article-id = ${id} data-note-id=${element._id} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </td>
                </tr>`

            )
        })
        console.log(notes)
        $('#myModal').modal("show")

    })

    })
})

$("body").on("click", "button.delete-btn", function(){ 

    console.log("delete clicked")

    var articleId = $(this).attr("data-article-id")
    var noteId = $(this).attr("data-note-id")

    console.log("articleID", articleId)
    console.log("noteID", noteId)




  $.post("/api/delete/"+articleId, {_id: noteId})
    .done(function(data){
        console.log(data)
        $.get("/api/articles/" + articleId, function(data){

        var notes = data.note
        var modalBody = $(".modal-body")

        $('#table-body').html('');

        notes.forEach(function (element){
            $('#table-body').append(
                `<tr>
                    <td>${element.comment}</td>
                    <td>
                        <button class="delete-btn" data-article-id = ${articleId} data-note-id=${element._id} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </td>
                </tr>`

            )
        })
        
        console.log(notes)
        $('#myModal').modal("show")

    })

    })
})

