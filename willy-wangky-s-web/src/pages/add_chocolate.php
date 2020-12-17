<!DOCTYPE html>
<html>
    <head>
        <title>Add a New Chocolate - Choco Shop</title>
        <link rel="stylesheet" href="/static/css/header.css">
        <link rel="stylesheet" href="/static/css/rizky.css">
        <link rel="stylesheet" href="/static/css/add_chocolate.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>  
      <?php $nav_page = 'add_chocolate'; include __DIR__.'/../components/header.php' ?>
      <div id="container">
        <h1>Add a New Chocolate</h1>
        <?php
          if ($res["code"] != 200) {
            echo "ERROR ON LOADING MATERIALS";
          } else {
        ?>
          <form enctype="multipart/form-data"  onsubmit="addChocolate(event)" action='/api/chocolates/add' method="POST">
            <input type="hidden" name="soft_return" value="true" />
            <div class='form_pair'>
              <span class='form_input_description'>Name</span> 
              <input class='form_input' name='name' type='text' placeholder="Chocolate Name" maxlength="99" required>
            </div>
            <div class='form_pair'>
              <span class='form_input_description'>Price</span>
              <input class='form_input' name='price' type='number' min="0" placeholder="Chocolate Price" required>
            </div>
            <div class='form_pair'>
              <span class='form_input_description'>Description</span> 
              <textarea class='form_input' name='description' placeholder="Chocolate Description" maxlength="499"></textarea>
            </div>
            <div class='form_pair'>
              <span class='form_input_description'>Image (max. 5MB)</span> 
              <input type="hidden" name="MAX_FILE_SIZE" value="5000000" />
              <input class='form_input' name='image' type='file' accept=".png,.jpeg,.jpg" required>
            </div>
            <div class='form_pair'>
              <span class='form_input_description'>Total Materials Price</span>
              <span class='form_calculator'>Rp <span id="materials_total_price">0</span></span>
            </div>
            <div class='form_pair'>
              <span class='form_input_description'>Material</span>
              <div class="form_input_materials">
                <?php
                  foreach (json_decode($res["result"], true) as $idx=>$material) {
                    $id = $material["id"];
                    echo '<div class="form_input_material">
                            <input type="number" name="materials['.$id.']" min="0"
                              id="material-'.$id.'" placeholder="insert amount" 
                              onchange="triggerMaterial('.$id.','.$idx.')" onkeyup="triggerMaterial('.$id.','.$idx.')">
                            <label for="'.$id.'">'.$material['name'].'</label>
                            
                          </div>';
                  }
                ?>
              </div>
            </div>
            <input class="form_input" type='submit' value='Add Chocolate'>
          </form>
        <?php } ?>
      </div>
      <?php
        if ($res["code"] == 200) {
          echo "<script> var materials = ".$res["result"]."</script>";
          echo "<script src='/static/js/add_chocolate.js'></script>";
        }
      ?>
      <script src="/static/js/responsive.js"></script>
    </body>
</html>